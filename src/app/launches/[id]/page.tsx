// pages/launches/[id].tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Rocket {
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
}

interface Launch {
  flight_number: number;
  mission_name: string;
  launch_year: string;
  launch_date_local: string;
  launch_success: boolean;
  rocket?: Rocket | null; // Rocket is optional and nullable
}

export default function LaunchDetails() {
  const { id } = useParams();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v3/launches/${id}`);
        setLaunch(response.data || null);
      } catch (error) {
        setError('Error fetching launch details');
        console.error('Error fetching launch details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black border-solid mb-6 mx-auto"></div>
          <p className="text-xl text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (!launch) {
    return <div className="text-center mt-10 text-gray-700">Launch not found</div>;
  }

  const rocket = launch.rocket ?? { rocket_id: 'N/A', rocket_name: 'N/A', rocket_type: 'N/A' };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10">
      <div className="container mx-auto p-6 shadow-lg rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-black">{launch.mission_name}</h1>
          <Link href="/" className="text-lg text-gray-600 hover:underline">
            Back to Home
          </Link>
        </div>
        <div className="space-y-4">
          <p className="text-xl text-gray-600">
            <strong>Flight Number:</strong> {launch.flight_number}
          </p>
          <p className="text-xl text-gray-600">
            <strong>Launch Year:</strong> {launch.launch_year}
          </p>
          <p className="text-xl text-gray-600">
            <strong>Launch Date:</strong> {launch.launch_date_local}
          </p>
          <p className="text-xl text-gray-600">
            <strong>Launch Success:</strong> {launch.launch_success ? 'Yes' : 'No'}
          </p>

          <h2 className="text-2xl font-semibold text-black mt-6">Rocket Details</h2>
          <p className="text-xl text-gray-600">
            <strong>Rocket ID:</strong> {rocket.rocket_id}
          </p>
          <p className="text-xl text-gray-600">
            <strong>Rocket Name:</strong> {rocket.rocket_name}
          </p>
          <p className="text-xl text-gray-600">
            <strong>Rocket Type:</strong> {rocket.rocket_type}
          </p>
        </div>
      </div>
    </div>
  );
}
