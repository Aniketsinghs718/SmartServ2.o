import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import { WorkingHours } from '../../types';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const WorkingHoursPage: React.FC = () => {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(
    DAYS.map(day => ({
      day,
      isAvailable: day !== 'sunday',
      startTime: '09:00',
      endTime: '18:00'
    }))
  );

  const handleAvailabilityChange = (day: typeof DAYS[number]) => {
    setWorkingHours(prev =>
      prev.map(item =>
        item.day === day
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
  };

  const handleTimeChange = (
    day: typeof DAYS[number],
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWorkingHours(prev =>
      prev.map(item =>
        item.day === day
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving working hours:', workingHours);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Working Hours</h1>
          <p className="text-gray-600">Set your availability for each day of the week</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Schedule Configuration
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {workingHours.map(({ day, isAvailable, startTime, endTime }) => (
              <div
                key={day}
                className={`border rounded-lg p-4 ${
                  isAvailable ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`available-${day}`}
                      checked={isAvailable}
                      onChange={() => handleAvailabilityChange(day)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`available-${day}`}
                      className="ml-2 block text-sm font-medium text-gray-900"
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </label>
                  </div>
                </div>

                {isAvailable && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`start-${day}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Start Time
                      </label>
                      <select
                        id={`start-${day}`}
                        value={startTime}
                        onChange={(e) =>
                          handleTimeChange(day, 'startTime', e.target.value)
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`end-${day}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        End Time
                      </label>
                      <select
                        id={`end-${day}`}
                        value={endTime}
                        onChange={(e) =>
                          handleTimeChange(day, 'endTime', e.target.value)
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursPage;