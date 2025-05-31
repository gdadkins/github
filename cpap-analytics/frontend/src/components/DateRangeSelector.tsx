import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export type DateRangePreset = '7d' | '30d' | '90d' | '180d' | '365d' | 'all';

interface DateRangeSelectorProps {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
  isPremium?: boolean;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ 
  value, 
  onChange, 
  isPremium = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const options = [
    { value: '7d', label: 'Last 7 days', premium: false },
    { value: '30d', label: 'Last 30 days', premium: false },
    { value: '90d', label: 'Last 90 days', premium: true },
    { value: '180d', label: 'Last 6 months', premium: true },
    { value: '365d', label: 'Last year', premium: true },
    { value: 'all', label: 'All time', premium: true },
  ];

  const currentOption = options.find(opt => opt.value === value);

  const handleSelect = (preset: DateRangePreset) => {
    const option = options.find(opt => opt.value === preset);
    if (option && (!option.premium || isPremium)) {
      onChange(preset);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-md min-w-[180px] justify-between"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{currentOption?.label || 'Select range'}</span>
        </div>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-[9998] lg:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-[9999] mt-2 w-56 rounded-lg shadow-2xl bg-white border border-slate-200 overflow-hidden backdrop-blur-sm">
          <div className="py-1" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value as DateRangePreset)}
                disabled={option.premium && !isPremium}
                className={`
                  w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors
                  ${option.premium && !isPremium 
                    ? 'text-slate-400 bg-slate-50 cursor-not-allowed' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }
                  ${value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : ''}
                `}
                role="menuitem"
              >
                <span>{option.label}</span>
                {option.premium && !isPremium && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                    Premium
                  </span>
                )}
              </button>
            ))}
          </div>
          {!isPremium && (
            <div className="border-t border-slate-100 p-3 bg-slate-50">
              <p className="text-xs text-slate-600">
                🚀 Unlock longer date ranges and advanced analytics with Premium
              </p>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeSelector;