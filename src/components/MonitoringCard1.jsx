import React, { useState, useEffect } from 'react';
// --- Cambio: Importar Line en lugar de Bar ---
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  // --- Cambio: Añadir PointElement y LineElement ---
  PointElement,
  LineElement,
  // --- Cambio: Eliminar BarElement ---
  // BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/MonitoringCard1.css'; // Importa los estilos CSS

// --- Cambio: Registrar PointElement y LineElement, eliminar BarElement ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, // Añadido
  LineElement,  // Añadido
  // BarElement, // Eliminado
  Title,
  Tooltip,
  Legend
);

const MonitoringCard1 = ({ userId }) => {
  const [chartData, setChartData] = useState({
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchWeeklyPlaytime = async () => {
      if (!userId) {
        setLoading(false);
        setError('No se proporcionó ID de usuario.');
        return;
      }

      setLoading(true);
      setError(null); // Limpiar errores previos

      try {
        // --- Obtener el token JWT ---
        // Reemplaza esto con tu lógica real para obtener el token
        const token = localStorage.getItem('jwtToken'); // Ejemplo: obtener de localStorage
        if (!token) {
          throw new Error('Usuario no autenticado.');
        }
        // --- Fin Obtener token ---

        const response = await fetch(`/api/estadistica/usuario/${userId}/tiempo-semanal`, { // <-- URL relativa
          headers: {
            'Authorization': `Bearer ${token}`, // Incluir el token JWT
            'Content-Type': 'application/json'
          }
        });
        // --- Fin Modificación ---

        if (!response.ok) {
          // Intentar leer el mensaje de error del cuerpo si existe
          const errorData = await response.json().catch(() => ({})); // Intenta parsear JSON, si falla, objeto vacío
          throw new Error(`Error ${response.status}: ${errorData.mensaje || response.statusText}`);
        }

        const weeklyData = await response.json(); // La API devuelve directamente el array de horas

        // Validar que weeklyData sea un array de 7 números
        if (!Array.isArray(weeklyData) || weeklyData.length !== 7 || !weeklyData.every(item => typeof item === 'number')) {
            console.error("Formato de datos inesperado recibido de la API:", weeklyData);
            throw new Error('Los datos recibidos de la API no tienen el formato esperado.');
        }

        // --- Modificación: Adaptar dataset al estilo de Line chart ---
        setChartData({
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Tiempo de Juego (horas)',
              data: weeklyData,
              fill: true, // Rellenar área bajo la línea
              backgroundColor: (context) => { // Usar función para gradiente
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height * 0.6);
                gradient.addColorStop(0, 'rgba(2, 190, 239, 0.5)'); // Inicio del gradiente (igual que Card2)
                gradient.addColorStop(1, 'rgba(2, 190, 239, 0.05)'); // Fin del gradiente (igual que Card2)
                return gradient;
              },
              borderColor: 'rgb(0, 170, 220)', // Color de línea (igual que Card2)
              tension: 0.3, // Línea suave (igual que Card2)
              pointBackgroundColor: 'rgb(0, 170, 220)', // Color de puntos (igual que Card2)
              pointBorderColor: '#fff', // Borde de puntos (igual que Card2)
              pointRadius: 4, // Tamaño de puntos (igual que Card2)
              pointHoverRadius: 6, // Tamaño de puntos al pasar el ratón (igual que Card2)
              pointHoverBackgroundColor: '#fff', // Color de fondo de puntos al pasar el ratón (igual que Card2)
              pointHoverBorderColor: 'rgb(0, 170, 220)' // Color de borde de puntos al pasar el ratón (igual que Card2)
              // --- Eliminadas propiedades específicas de Bar chart ---
              // borderWidth: 1,
              // borderRadius: 5,
              // hoverBackgroundColor: 'rgba(2, 190, 239, 0.8)',
              // hoverBorderColor: 'rgb(0, 170, 220)',
            },
          ],
        });
        // --- Fin Modificación ---

      } catch (error) {
        console.error("Error fetching weekly playtime:", error);
        setError(error.message || "Error al cargar los datos del tiempo de juego.");
        setChartData({ // Limpiar datos en caso de error
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [],
        });
      } finally {
        setLoading(false);
      }
    };

    // Llama a la función si tienes un userId
    fetchWeeklyPlaytime();

  }, [userId]); // Vuelve a cargar si cambia el userId

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
              // Mantenemos el formato de horas
              label += parseFloat(context.parsed.y.toFixed(1)) + ' horas';
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
          callback: function(value) {
             // Mantenemos el formato de horas
             return parseFloat(value.toFixed(1)) + 'h';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        title: {
          display: true, // Mantenemos el título del eje Y
          text: 'Horas de Juego', // Añadimos texto al título del eje Y
          color: 'rgba(255, 255, 255, 0.8)'
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
          display: true, // Mantenemos el título del eje X
          text: 'Día de la Semana', // Añadimos texto al título del eje X
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
    },
  };

  return (
    <div className="monitoring-card monitoring-card-1">
      <h3>Tiempo de Juego Semanal</h3>
      <div className="chart-container" style={{ height: '250px', position: 'relative' }}>
        {loading ? (
          <p>Cargando datos del gráfico...</p>
        ) : error ? (
            <p className="error-message">{error}</p>
        // --- Cambio: Renderizar Line en lugar de Bar ---
        ) : chartData.datasets && chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0 ? ( // Asegurarse que hay datos antes de renderizar
          <Line options={options} data={chartData} />
        ) : (
          // Mensaje si no hay datos o hubo error
          <p>{error ? error : 'No hay datos de tiempo de juego disponibles.'}</p>
        )}
        {/* --- Fin Cambio --- */}
      </div>
    </div>
  );
};

export default MonitoringCard1;