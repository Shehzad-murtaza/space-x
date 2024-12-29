// pages/index.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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
  rocket?: Rocket | null; // Make rocket optional and nullable
}

export default function Home() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://api.spacexdata.com/v3/launches');
        setLaunches(response.data || []);
      } catch (error) {
        console.error('Error fetching launches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  if (!launches.length) {
    return <div className="text-center mt-10 text-gray-700">No launches available</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10">
      <div className="container mx-auto p-6 shadow-lg rounded-lg bg-gray-50">
        <h1 className="text-4xl font-semibold text-black text-center">SpaceX Launches</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {launches.map((launch) => (
            <li
              key={`${launch.flight_number}-${launch.mission_name}`} // Ensure unique key
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/launches/${launch.flight_number}`}>
                <div className="block text-center text-black font-medium text-xl">
                  <h3>{launch.mission_name}</h3>
                  <p className="text-sm text-gray-600">{launch.launch_year}</p>
                  <p className="text-sm text-gray-500">{launch.launch_date_local}</p>
                  <div className="mt-2">
                    <p className="text-sm text-green-500">
                      {launch.launch_success ? 'Success' : 'Failed'}
                    </p>
                    {/* Proper null check for rocket */}
                    <p className="text-sm text-gray-600">
                      Rocket: {launch.rocket?.rocket_name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Rocket Type: {launch.rocket?.rocket_type || 'N/A'}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
