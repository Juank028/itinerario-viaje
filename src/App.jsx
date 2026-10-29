import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Plus, MapPin, Compass, Image as ImageIcon, Clock } from 'lucide-react';

// Inicialización de Supabase con tus variables o llaves directas si prefieres prueba rápida
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cargar viajes al iniciar
  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      const { data, error } = await supabase.from('trips').select('*');
      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error cargando viajes:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTrip(e) {
    e.preventDefault();
    if (!newTripTitle || !startDate || !endDate) return;

    try {
      // Nota: Si aún no usas login de usuarios en Supabase, puedes omitir user_id o asignar uno genérico temporalmente
      const { data, error } = await supabase.from('trips').insert([
        {
          title: newTripTitle,
          start_date: startDate,
          end_date: endDate,
        },
      ]).select();

      if (error) throw error;
      
      setNewTripTitle('');
      setStartDate('');
      setEndDate('');
      fetchTrips();
    } catch (error) {
      alert('Error al crear el viaje: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header / Landing Motivacional */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-16 px-6 text-center shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <Compass size={48} className="animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Organizador de Itinerarios de Viaje</h1>
          <p className="text-lg text-indigo-100 mb-6">
            Planifica tus actividades hora por hora, controla tus tiempos y guarda los mejores recuerdos de cada destino.
          </p>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Formulario para Crear un Viaje */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-slate-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900">
            <Plus size={20} /> Crear Nuevo Viaje
          </h2>
          <form onSubmit={createTrip} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nombre del viaje (ej: Europa 2026)"
              value={newTripTitle}
              onChange={(e) => setNewTripTitle(e.target.value)}
              className="border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-1"
              required
            />
            <div>
              <label className="block text-xs text-slate-500 mb-1">Fecha de Ida</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-xl p-3 w-full outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Fecha de Regreso</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-xl p-3 w-full outline-none"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-sm"
              >
                Guardar Viaje
              </button>
            </div>
          </form>
        </section>

        {/* Lista de Viajes Creados */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Tus Viajes Registrados</h2>
          {loading ? (
            <p className="text-slate-500">Cargando viajes...</p>
          ) : trips.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
              <p className="text-slate-400 mb-2">Aún no tienes ningún viaje registrado en Supabase.</p>
              <p className="text-sm text-slate-500">Usa el formulario de arriba para agregar el primero.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{trip.title}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                      <Calendar size={16} /> {trip.start_date} al {trip.end_date}
                    </p>
                  </div>
                  <button className="mt-4 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium py-2 px-4 rounded-xl transition text-sm">
                    Ver Itinerario y Actividades &rarr;
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}