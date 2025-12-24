import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { api, WebSocketService, type EnvironmentData } from "../services/api";
import { Thermometer, Droplets, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [currentData, setCurrentData] = useState<EnvironmentData | null>(null);
  const [history, setHistory] = useState<EnvironmentData[]>([]);
  const [ws] = useState(() => new WebSocketService());

  useEffect(() => {
    // Charger l'historique
    api.getHistory(30).then(({ data }) => {
      setHistory(data.reverse());
      if (data.length > 0) setCurrentData(data[data.length - 1]);
    });

    // Connexion WebSocket
    ws.connect((data) => {
      setCurrentData(data);
      setHistory((prev) => [...prev.slice(-29), data]);
    });

    return () => ws.disconnect();
  }, [ws]);

  const chartData = {
    labels: history.map((d) =>
      new Date(d.timestamp).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Température (°C)",
        data: history.map((d) => d.temperatureCelsius),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Humidité (%)",
        data: history.map((d) => d.humidityPercent),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#e2e8f0",
          font: { size: 14, weight: "600" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#e2e8f0",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(148, 163, 184, 0.1)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: { color: "rgba(239, 68, 68, 0.1)" },
        ticks: { color: "#ef4444", font: { size: 12, weight: "600" } },
        title: {
          display: true,
          text: "Température (°C)",
          color: "#ef4444",
          font: { size: 13, weight: "700" },
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: { color: "#3b82f6", font: { size: 12, weight: "600" } },
        title: {
          display: true,
          text: "Humidité (%)",
          color: "#3b82f6",
          font: { size: 13, weight: "700" },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            IoT Monitor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            Surveillance en temps réel
          </p>
        </div>

        {/* Cards actuelles */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Température */}
          <div className="glass-card group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/50 group-hover:shadow-red-500/70 transition-shadow">
                  <Thermometer className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    Température
                  </p>
                  <p className="text-xs text-slate-500">Actuelle</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                {currentData?.temperatureCelsius?.toFixed(1) ?? "--"}°C
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {currentData &&
                  new Date(currentData.timestamp).toLocaleString("fr-FR")}
              </div>
            </div>
          </div>

          {/* Humidité */}
          <div className="glass-card group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/70 transition-shadow">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Humidité</p>
                  <p className="text-xs text-slate-500">Actuelle</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {currentData?.humidityPercent ?? "--"}%
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Capteur {currentData?.sensor}
              </div>
            </div>
          </div>
        </div>

        {/* Graphique */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Historique des mesures
          </h2>
          <div className="h-[400px]">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Info capteur */}
        <div className="glass-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                Device
              </p>
              <p className="text-white font-bold text-lg">
                {currentData?.device ?? "--"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                Capteur
              </p>
              <p className="text-white font-bold text-lg">
                {currentData?.sensor ?? "--"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                Location
              </p>
              <p className="text-white font-bold text-lg">
                {currentData?.location ?? "--"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                Source
              </p>
              <p className="text-white font-bold text-lg">
                {currentData?.dataSource ?? "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
