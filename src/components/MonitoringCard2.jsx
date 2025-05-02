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
} from 'chart.js';
import '../styles/MonitoringCard2.css'; // Importa los estilos CSS

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

  useEffect(() => {
    // --- Simulación de carga de datos ---
    // En una aplicación real, aquí harías una llamada a tu API
    // para obtener las monedas gastadas por nivel para el userId.
    // Ejemplo: fetch(`/api/estadistica/usuario/${userId}/monedas-por-nivel`)
    const fetchCoinsPerLevel = async () => {
      setLoading(true);
      try {
        // Simulación: Reemplaza esto con tu llamada API real
        await new Promise(resolve => setTimeout(resolve, 600)); // Simular delay de red
        // Datos de ejemplo: monedas gastadas en cada nivel (13 niveles)
        const coinsData = [50, 75, 120, 90, 150, 200, 180, 250, 300, 280, 350, 400, 320];

        setChartData({
          labels: Array.from({ length: 13 }, (_, i) => `Nivel ${i + 1}`),
          datasets: [
            {
              label: 'Monedas Gastadas',
              data: coinsData,
              fill: true, // Rellenar área bajo la línea
              // --- Cambios de Estilo ---
              backgroundColor: (context) => { // Usar función para gradiente
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height * 0.6); // Ajusta la altura del gradiente
                gradient.addColorStop(0, 'rgba(2, 190, 239, 0.5)'); // Inicio del gradiente
                gradient.addColorStop(1, 'rgba(2, 190, 239, 0.05)'); // Fin del gradiente (más transparente)
                return gradient;
              },
              borderColor: 'rgb(0, 170, 220)', // Un azul vibrante para la línea
              tension: 0.3, // Línea un poco más suave
              pointBackgroundColor: 'rgb(0, 170, 220)',
              pointBorderColor: '#fff',
              pointRadius: 4, // Puntos un poco más grandes
              pointHoverRadius: 6, // Puntos más grandes al pasar el ratón
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(0, 170, 220)'
              // --- Fin Cambios de Estilo ---
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching coins per level:", error);
        // Manejar el error
      } finally {
        setLoading(false);
      }
    };

    // Por ahora, llamamos directamente para mostrar la gráfica con datos simulados
    // Deberías condicionar esto a la existencia de `userId` en un caso real
    fetchCoinsPerLevel();

  }, [userId]); // Vuelve a cargar si cambia el userId

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // Añadir configuración de interacción
    interaction: {
      mode: 'index', // Encuentra elementos en el mismo índice (verticalmente)
      intersect: false, // Muestra tooltip aunque no se esté directamente sobre el punto
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
              // Añadir símbolo de moneda o texto "monedas"
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
          color: 'rgba(255, 255, 255, 0.8)', // Un poco más visible
          // Podrías añadir un callback para formatear los números si son muy grandes
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)', // Líneas de cuadrícula más sutiles
        },
        title: { // Título del eje Y
          display: true,
          color: 'rgba(255, 255, 255, 0.8)', // Un poco más visible
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)', // Un poco más visible
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)', // Líneas de cuadrícula más sutiles
        },
         title: { // Título del eje X
          display: true,
          color: 'rgba(255, 255, 255, 0.8)', // Un poco más visible
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
        ) : chartData.datasets.length > 0 ? (
          <Line options={options} data={chartData} />
        ) : (
          <p>No hay datos de monedas gastadas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default MonitoringCard2;