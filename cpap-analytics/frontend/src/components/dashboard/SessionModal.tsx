import React from 'react';
import { getAHIStatus } from '../../constants/medical';

interface Session {
  date: string;
  duration_hours: number;
  ahi: number;
  mask_leak: number;
  pressure_avg: number;
  quality_score: number;
}

interface SessionModalProps {
  session: Session | null;
  onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ session, onClose }) => {
  if (!session) return null;

  const ahiStatus = getAHIStatus(session.ahi);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Session Details - {new Date(session.date).toLocaleDateString()}
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Therapy Metrics</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Duration:</dt>
                  <dd className="font-medium">{session.duration_hours} hours</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">AHI:</dt>
                  <dd className={`font-medium ${
                    ahiStatus === 'excellent' ? 'text-green-600' : 
                    ahiStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {session.ahi} events/hour
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Quality Score:</dt>
                  <dd className="font-medium">{session.quality_score}%</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Equipment Metrics</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Mask Leak:</dt>
                  <dd className="font-medium">{session.mask_leak} L/min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Average Pressure:</dt>
                  <dd className="font-medium">{session.pressure_avg} cmH₂O</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;