import { FaDownload } from 'react-icons/fa';

interface ExportData {
  code: string;
  name: string;
  population: number;
  growthRate: number;
  birthsPerSec: number;
  deathsPerSec: number;
  density?: number;
}

export const exportToCSV = (data: ExportData[], filename: string) => {
  const headers = ['Code', 'Name', 'Population', 'Growth Rate (%)', 'Births/sec', 'Deaths/sec', 'Density (/km²)'];
  const rows = data.map(d => [
    d.code,
    d.name,
    d.population,
    d.growthRate?.toFixed(2) || 'N/A',
    d.birthsPerSec?.toFixed(3) || 'N/A',
    d.deathsPerSec?.toFixed(3) || 'N/A',
    d.density || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: ExportData[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface ExportButtonProps {
  data: ExportData[];
  filename: string;
  variant?: 'csv' | 'json' | 'both';
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, variant = 'both' }) => {
  return (
    <div className="flex gap-2">
      {(variant === 'csv' || variant === 'both') && (
        <button
          onClick={() => exportToCSV(data, filename)}
          className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors text-sm font-medium"
        >
          <FaDownload size={14} />
          CSV
        </button>
      )}
      {(variant === 'json' || variant === 'both') && (
        <button
          onClick={() => exportToJSON(data, filename)}
          className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors text-sm font-medium"
        >
          <FaDownload size={14} />
          JSON
        </button>
      )}
    </div>
  );
};

export default ExportButton;
