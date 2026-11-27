import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih opsi...',
  label,
  className = '',
  disabled = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-3.5 py-2.5 text-xs',
    lg: 'px-4 py-3 text-xs sm:text-sm',
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${
          sizeClasses[size]
        } rounded-xl bg-[#F8FAFC] hover:bg-slate-50 border transition-all duration-200 flex items-center justify-between gap-2.5 text-left font-bold ${
          isOpen
            ? 'border-[#0095FF] ring-2 ring-[#0095FF]/15 bg-white'
            : 'border-slate-200/90 hover:border-[#0095FF]/60'
        } ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-slate-100'
            : 'cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption?.icon && (
            <span className="shrink-0 text-[#0095FF]">
              {selectedOption.icon}
            </span>
          )}
          <div className="truncate">
            {selectedOption ? (
              <span className="text-[#111827]">{selectedOption.label}</span>
            ) : (
              <span className="text-[#94A3B8] font-medium">{placeholder}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedOption?.badge && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9.5px] font-extrabold rounded-md bg-[#EBF5FF] text-[#0095FF]">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0095FF]' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl border border-slate-100 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.14)] p-1.5 max-h-64 overflow-y-auto focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between gap-2.5 text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-[#F0F7FF] text-[#0095FF]'
                      : 'hover:bg-slate-50 text-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {option.icon && (
                      <span
                        className={`shrink-0 transition-colors ${
                          isSelected
                            ? 'text-[#0095FF]'
                            : 'text-[#94A3B8] group-hover:text-[#0095FF]'
                        }`}
                      >
                        {option.icon}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected
                              ? 'text-[#0095FF]'
                              : 'text-[#1E293B] group-hover:text-[#111827]'
                          }`}
                        >
                          {option.label}
                        </span>
                        {option.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded ${
                              isSelected
                                ? 'bg-white text-[#0095FF]'
                                : 'bg-[#EBF5FF] text-[#0095FF]'
                            }`}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <p
                          className={`text-[10.5px] truncate mt-0.5 ${
                            isSelected
                              ? 'text-[#0095FF]/80 font-medium'
                              : 'text-[#94A3B8]'
                          }`}
                        >
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0095FF] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
