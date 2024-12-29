'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Rocket, ArrowUpRight, Calendar, Info } from 'lucide-react';

interface SpaceXRocket {
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
  rocket?: SpaceXRocket | null;
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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <Rocket className="absolute inset-0 m-auto text-blue-500 w-10 h-10 animate-pulse" />
          </div>
          <p className="text-xl text-gray-800 font-light">Loading missions...</p>
        </div>
      </div>
    );
  }

  if (!launches.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Info className="w-16 h-16 text-gray-400 mx-auto" />
          <p className="text-xl text-gray-600">No launches available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
            SpaceX Launches
          </h1>
          <p className="text-gray-600 text-lg">Exploring the future of space travel</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {launches.map((launch) => (
            <Link
              href={`/launches/${launch.flight_number}`}
              key={`${launch.flight_number}-${launch.mission_name}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {launch.mission_name}
                    </h3>
                    <p className="text-gray-500 text-sm">{launch.launch_year}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <p className="text-sm">
                      {new Date(launch.launch_date_local).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      launch.launch_success
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {launch.launch_success ? 'Successful' : 'Failed'}
                    </span>
                    
                    <div className="flex items-center text-gray-600">
                      <Rocket className="w-4 h-4 mr-2" />
                      <span className="text-sm">{launch.rocket?.rocket_name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}