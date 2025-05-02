import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  // --- Añadir: Importar Filler ---
  Filler,
} from 'chart.js';
import '../styles/MonitoringCard2.css'; // Importa los estilos CSS

// --- Añadir: Registrar Filler ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Registrar el plugin
);

// Registrar los componentes necesarios de Chart.js para Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Asumimos que recibes userId como prop, igual que en MonitoringCard1
const MonitoringCard2 = ({ userId }) => {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 13 }, (_, i) => `Nivel ${i + 1}`), // Labels Nivel 1 a 13
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchCoinsPerLevel = async () => {
      // Solo intentar cargar si tenemos un userId
      if (!userId) {
        setLoading(false);
        setError("ID de usuario no disponible.");
        console.log("MonitoringCard2: No userId provided, skipping fetch.");
        return;
      }

      setLoading(true);
      setError(null); // Limpiar errores previos

      // Obtener el token JWT de localStorage (o donde lo almacenes)
      const token = localStorage.getItem('jwtToken'); // Asegúrate que la clave sea correcta

      if (!token) {
          setLoading(false);
          setError("No autenticado. Token no encontrado.");
          console.error("MonitoringCard2: JWT Token not found in localStorage.");
          return;
      }

      try {
        // --- Llamada real a la API ---
        const response = await fetch(`/api/estadistica/usuario/${userId}/monedas-por-nivel`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token JWT
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
          // Manejar respuestas no exitosas (ej. 401, 403, 404, 500)
          const errorData = await response.json().catch(() => ({ message: 'Error desconocido al obtener datos.' }));
          throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }

        const data = await response.json(); // data debería ser [{ nivel: 1, totalMonedasGastadas: '225' }, ...]

        // Validar que recibimos un array
        if (!Array.isArray(data)) {
            console.error("Formato de datos inesperado recibido de la API:", data);
            throw new Error("Formato de datos inesperado recibido de la API.");
        }

        // --- Procesar el array de objetos ---
        const coinsMap = new Map();
        data.forEach(item => {
            // Esta condición comprueba si 'item' es un objeto válido con las propiedades esperadas
            if (item && typeof item.nivel === 'number' && item.totalMonedasGastadas !== undefined) {
                // Convertir totalMonedasGastadas a número
                const coins = parseInt(item.totalMonedasGastadas, 10);
                // Guardar en el mapa si la conversión es exitosa
                if (!isNaN(coins)) {
                    coinsMap.set(item.nivel, coins);
                } else {
                    console.warn(`Valor inválido para totalMonedasGastadas en nivel ${item.nivel}:`, item.totalMonedasGastadas);
                    coinsMap.set(item.nivel, 0); // O manejar como prefieras
                }
            } else {
                 // Si la condición de arriba falla, se ejecuta esto.
                 // Si 'item' es 0, la condición falla porque 0 no tiene la propiedad 'nivel'.
                 console.warn("Item inválido o incompleto recibido de la API:", item);
            }
        });

        // 2. Crear el array final de datos para la gráfica (13 niveles)
        const finalCoinsData = Array.from({ length: 13 }, (_, i) => {
            const nivel = i + 1;
            // Obtener el valor del mapa o usar 0 si no existe
            return coinsMap.get(nivel) || 0;
        });
        // --- Fin del procesamiento ---


        setChartData({
          labels: Array.from({ length: 13 }, (_, i) => `Nivel ${i + 1}`),
          datasets: [
            {
              label: 'Monedas Gastadas',
              data: finalCoinsData, // Usar los datos procesados
              fill: true,
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height * 0.6);
                gradient.addColorStop(0, 'rgba(2, 190, 239, 0.5)');
                gradient.addColorStop(1, 'rgba(2, 190, 239, 0.05)');
                return gradient;
              },
              borderColor: 'rgb(0, 170, 220)',
              tension: 0.3,
              pointBackgroundColor: 'rgb(0, 170, 220)',
              pointBorderColor: '#fff',
              pointRadius: 4,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(0, 170, 220)'
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching coins per level:", error);
        setError(error.message || "Error al cargar los datos de monedas.");
        setChartData({ // Limpiar datos en caso de error
            labels: Array.from({ length: 13 }, (_, i) => `Nivel ${i + 1}`),
            datasets: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoinsPerLevel();

  }, [userId]); // Vuelve a cargar si cambia el userId

  // ... el resto del componente (options, return) permanece igual ...

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' monedas';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        title: {
          display: true,
          text: 'Monedas', // Añadir texto al título del eje Y
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
         title: {
          display: true,
          text: 'Nivel', // Añadir texto al título del eje X
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
    },
  };

  return (
    <div className="monitoring-card monitoring-card-2">
      <h3>Monedas Gastadas por Nivel</h3>
      <div className="chart-container" style={{ height: '250px', position: 'relative'}}>
        {loading ? (
          <p>Cargando datos del gráfico...</p>
        ) : error ? ( // Mostrar mensaje de error si existe
          <p className="error-message">{error}</p>
        ) : chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0 ? ( // Asegurarse que hay datos
          <Line options={options} data={chartData} />
        ) : (
          <p>No hay datos de monedas gastadas disponibles para mostrar.</p> // Mensaje si no hay datos o error
        )}
      </div>
    </div>
  );
};

export default MonitoringCard2;