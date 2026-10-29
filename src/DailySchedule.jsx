import React from 'react';
import { Clock, MapPin, Plus } from 'lucide-react';

export default function DailySchedule({ selectedDate, activities, onOpenAddModal }) {
  // Genera las horas desde las 6 AM (6) hasta las 10 PM (22)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  const getActivityForHour = (hour) => {
    return activities.filter((act) => {
      if (!act.start_time) return false;
      const startHour = parseInt(act.start_time.split(':')[0], 10);
      return startHour === hour;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto my-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Monitoreo Diario de Actividades</h3>
          <p className="text-sm text-slate-500">Fecha seleccionada: <span className="font-semibold text-indigo-600">{selectedDate || 'Selecciona un día'}</span></p>
        </div>
        <button
          onClick={() => onOpenAddModal(selectedDate)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm"
        >
          <Plus size={18} /> Agregar Actividad
        </button>
      </div>

      <div className="space-y-3">
        {hours.map((hour) => {
          const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
          const matchedActivities = getActivityForHour(hour);

          return (
            <div key={hour} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition border-b border-slate-100">
              <div className="w-20 font-semibold text-slate-500 text-sm flex items-center gap-1 pt-1">
                <Clock size={14} />
                {hourLabel}
              </div>

              <div className="flex-1 min-h-[40px]">
                {matchedActivities.length > 0 ? (
                  matchedActivities.map((act) => (
                    <div key={act.id} className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded-r-xl mb-2 shadow-sm">
                      <p className="font-bold text-indigo-950">{act.title}</p>
                      {act.location && (
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {act.location}
                        </p>
                      )}
                      {act.start_time && (
                        <span className="text-xs font-semibold text-indigo-600 mt-1 block">
                          Hora: {act.start_time} {act.end_time ? `- ${act.end_time}` : ''}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-300 italic pt-2 block">Tiempo disponible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}