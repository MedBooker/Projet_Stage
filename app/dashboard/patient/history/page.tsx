'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  const history = [
    {
      date: '5 juin 2025',
      doctor: 'Dr. Moussa NDIAYE',
      notes: 'Consultation dermatologique pour suivi acné sévère.',
    },
    {
      date: '15 avril 2025',
      doctor: 'Dr. Gervais MENDY',
      notes: 'Vaccination DTCP + bilan de santé général.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Historique Médical
        </h1>
        {history.map((record, index) => (
          <Card key={index} className="mb-6 bg-white dark:bg-gray-900 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{record.doctor}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">{record.date}</p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{record.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}