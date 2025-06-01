import React from 'react';
import { getDateRangeLabel } from '../../utils/dateHelpers';
import { getAHIStatus } from '../../constants/medical';
import { DateRangePreset } from '../DateRangeSelector';
import { Session } from '../../types';

interface SessionsListProps {
  sessions: Session[];
  dateRange: DateRangePreset;
  onSessionSelect: (session: Session) => void;
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions, dateRange, onSessionSelect }) => {
  return (
    <div className="mb-8 bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Recent Sessions ({getDateRangeLabel(dateRange)})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AHI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mask Leak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pressure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session, index) => {
              const ahiStatus = getAHIStatus(session.ahi);
              return (
                <tr 
                  key={session.id || index} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSessionSelect(session)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(session.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.duration_hours}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      ahiStatus === 'excellent' ? 'text-green-600' : 
                      ahiStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {session.ahi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.mask_leak} L/min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.pressure_avg} cmH₂O
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">
                        {session.quality_score}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            session.quality_score >= 80 ? 'bg-green-500' :
                            session.quality_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${session.quality_score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsList;