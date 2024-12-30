'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Calendar, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'; // Loader2 removed

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
  rocket?: Rocket | null;
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            <Rocket className="absolute inset-0 m-auto text-blue-600 w-10 h-10 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 font-light">Loading missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-xl text-red-600">{error}</p>
          <Link href="/" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to launches
          </Link>
        </div>
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-gray-500 mx-auto" />
          <p className="text-xl text-gray-400">Launch not found</p>
          <Link href="/" className="text-blue-500 hover:text-blue-600 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to launches
          </Link>
        </div>
      </div>
    );
  }

  const rocket = launch.rocket ?? { rocket_id: 'N/A', rocket_name: 'N/A', rocket_type: 'N/A' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-gray-300 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to launches
        </Link>

        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-8 border-b border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">{launch.mission_name}</h1>
              <div
                className={`px-4 py-2 rounded-full ${
                  launch.launch_success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {launch.launch_success ? (
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Successful
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Failed
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Launch Date</p>
                    <p className="text-white">{launch.launch_date_local}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-400">
                  <Rocket className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Flight Number</p>
                    <p className="text-white">#{launch.flight_number}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Rocket Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    <span className="text-gray-500">Name:</span> {rocket.rocket_name}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-500">Type:</span> {rocket.rocket_type}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-500">ID:</span> {rocket.rocket_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
