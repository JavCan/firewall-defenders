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
  // --- Añadir: Importar Filler ---
  Filler,
} from 'chart.js';
import '../styles/MonitoringCard1.css'; // Importa los estilos CSS

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


const MonitoringCard1 = ({ userId }) => {
  const [chartData, setChartData] = useState({
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- INICIO: Añadir estado para valor máximo ---
  const [maxPlaytime, setMaxPlaytime] = useState(0);
  // --- FIN: Añadir estado para valor máximo ---

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

        const response = await fetch(`https://mrr4kvt4dj.execute-api.us-east-1.amazonaws.com/api/estadistica/usuario/${userId}/tiempo-semanal`, { // <-- URL CORREGIDA
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

        // --- INICIO: Calcular y guardar el valor máximo ---
        const currentMaxPlaytime = Math.max(...weeklyData, 0); // Calcula el máximo, asegura que sea al menos 0
        setMaxPlaytime(currentMaxPlaytime);
        // --- FIN: Calcular y guardar el valor máximo ---

        // --- Modificación: Adaptar dataset al estilo de Line chart ---
        setChartData({
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Tiempo de Juego', // Se ajustará en el tooltip
              data: weeklyData, // Mantenemos los datos en horas
              fill: true,
              // --- Cambio: Aplicar gradiente como en MonitoringCard2 ---
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                if (!ctx) return null; // Añadir verificación por si el contexto no está listo
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height * 0.6);
                if (!gradient) return null; // Añadir verificación por si el gradiente no se crea
                gradient.addColorStop(0, 'rgba(2, 190, 239, 0.5)'); // Azul claro semi-transparente
                gradient.addColorStop(1, 'rgba(2, 190, 239, 0.5)'); // Casi transparente
                return gradient;
              },
              // --- Fin Cambio ---
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
        // --- Fin Modificación ---

      } catch (error) {
        console.error("Error fetching weekly playtime:", error);
        setError(error.message || "Error al cargar los datos del tiempo de juego.");
        setChartData({ /* ... limpiar datos ... */ });
        setMaxPlaytime(0); // Resetear maxPlaytime en error
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyPlaytime();

  }, [userId]);

  // --- INICIO: Modificar Opciones del Gráfico ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // --- Cambio: Configurar interacción ---
    interaction: {
      mode: 'index', // Encuentra elementos en el mismo índice del eje X
      intersect: false, // Muestra tooltip aunque no se toque directamente el punto
    },
    // --- Fin Cambio ---
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        }
      },
      title: { /* ... */ },
      tooltip: {
        callbacks: {
          label: function(context) {
            const valueInHours = context.parsed.y;
            if (valueInHours === null) return '';

            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }

            // Si el valor es menor a 1 hora, mostrar en minutos
            if (valueInHours < 1 && valueInHours > 0) {
              const minutes = Math.round(valueInHours * 60);
              label += `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
            } else if (valueInHours === 0) {
                 label += '0 minutos'; // Mostrar 0 minutos explícitamente
            }
            // Si es 1 hora o más, mostrar en horas (con 1 decimal si es necesario)
            else {
              label += `${valueInHours.toFixed(1)} hora${valueInHours !== 1 ? 's' : ''}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        // --- Ajuste dinámico del máximo del eje Y ---
        // Si el máximo es menor a 1 hora, fijamos el máximo del eje en 1 (para que la escala de minutos funcione bien hasta 60m)
        max: maxPlaytime < 1 ? 1 : undefined,
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          // --- Cambio: Añadir stepSize para escala de minutos ---
          stepSize: maxPlaytime < 1 ? (1/6) : undefined, // 1/6 de hora = 10 minutos
          callback: function(value, index, ticks) {
            // Si el máximo de la semana es menor a 1 hora, mostrar eje en minutos
            if (maxPlaytime < 1) {
              // El 'value' aquí sigue estando en la escala de horas (0 a 1)
              const minutes = Math.round(value * 60);
              // Opcional: Evitar mostrar ticks duplicados si Chart.js los genera
              // const previousTickValue = index > 0 ? Math.round(ticks[index - 1].value * 60) : -1;
              // if (minutes === previousTickValue) return '';
              return `${minutes}m`;
            }
            // Si no, mostrar en horas
            else {
              // Puedes ajustar los decimales si es necesario
              // Si el valor es entero, no mostrar decimales
              return Number.isInteger(value) ? `${value}h` : `${value.toFixed(1)}h`;
            }
          }
          // --- Fin Cambio ---
        },
        grid: { /* ... */ },
        title: {
          display: true,
          // Título dinámico del eje Y
          text: maxPlaytime < 1 ? 'Minutos de Juego' : 'Horas de Juego',
          color: 'rgb(255, 255, 255)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 10,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
         title: {
          display: true,
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
    },
  };
  // --- FIN: Modificar Opciones del Gráfico ---

  return (
    <div className="monitoring-card monitoring-card-1">
      <h3>Tiempo de Juego Semanal</h3>
      <div className="chart-container" style={{ height: '250px', position: 'relative' }}>
        {loading ? (
          <p>Cargando datos del gráfico...</p>
        ) : error ? (
            <p className="error-message">{error}</p>
        // --- Cambio: Renderizar Line en lugar de Bar ---
        ) : chartData.datasets && chartData.datasets.length > 0 ? ( // Condición modificada para renderizar solo si hay datos
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