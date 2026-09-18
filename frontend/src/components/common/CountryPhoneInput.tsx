/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, CheckCircle2, Search, X } from 'lucide-react';

export interface CountryCode {
  code: string;
  name: string;
  iso: string;
  minDigits: number;
  maxDigits: number;
  example: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+91', name: 'India', iso: 'in', minDigits: 10, maxDigits: 11, example: '98765 43210' },
  { code: '+1', name: 'United States', iso: 'us', minDigits: 10, maxDigits: 10, example: '555 123 4567' },
  { code: '+44', name: 'United Kingdom', iso: 'gb', minDigits: 10, maxDigits: 11, example: '7911 123456' },
  { code: '+971', name: 'United Arab Emirates', iso: 'ae', minDigits: 9, maxDigits: 9, example: '50 123 4567' },
  { code: '+1', name: 'Canada', iso: 'ca', minDigits: 10, maxDigits: 10, example: '416 123 4567' },
  { code: '+61', name: 'Australia', iso: 'au', minDigits: 9, maxDigits: 10, example: '412 345 678' },
  { code: '+65', name: 'Singapore', iso: 'sg', minDigits: 8, maxDigits: 8, example: '9123 4567' },
  { code: '+966', name: 'Saudi Arabia', iso: 'sa', minDigits: 9, maxDigits: 10, example: '50 123 4567' },
  { code: '+974', name: 'Qatar', iso: 'qa', minDigits: 8, maxDigits: 8, example: '5512 3456' },
  { code: '+968', name: 'Oman', iso: 'om', minDigits: 8, maxDigits: 8, example: '9123 4567' },
  { code: '+965', name: 'Kuwait', iso: 'kw', minDigits: 8, maxDigits: 8, example: '9123 4567' },
  { code: '+973', name: 'Bahrain', iso: 'bh', minDigits: 8, maxDigits: 8, example: '3912 3456' },
  { code: '+49', name: 'Germany', iso: 'de', minDigits: 10, maxDigits: 11, example: '151 23456789' },
  { code: '+33', name: 'France', iso: 'fr', minDigits: 9, maxDigits: 10, example: '6 12 34 56 78' },
  { code: '+39', name: 'Italy', iso: 'it', minDigits: 9, maxDigits: 11, example: '312 345 6789' },
  { code: '+34', name: 'Spain', iso: 'es', minDigits: 9, maxDigits: 10, example: '612 34 56 78' },
  { code: '+31', name: 'Netherlands', iso: 'nl', minDigits: 9, maxDigits: 10, example: '6 12345678' },
  { code: '+41', name: 'Switzerland', iso: 'ch', minDigits: 9, maxDigits: 10, example: '79 123 45 67' },
  { code: '+46', name: 'Sweden', iso: 'se', minDigits: 9, maxDigits: 10, example: '70 123 45 67' },
  { code: '+353', name: 'Ireland', iso: 'ie', minDigits: 9, maxDigits: 10, example: '85 123 4567' },
  { code: '+64', name: 'New Zealand', iso: 'nz', minDigits: 8, maxDigits: 10, example: '21 123 4567' },
  { code: '+27', name: 'South Africa', iso: 'za', minDigits: 9, maxDigits: 10, example: '82 123 4567' },
  { code: '+234', name: 'Nigeria', iso: 'ng', minDigits: 10, maxDigits: 11, example: '803 123 4567' },
  { code: '+254', name: 'Kenya', iso: 'ke', minDigits: 9, maxDigits: 10, example: '712 345678' },
  { code: '+20', name: 'Egypt', iso: 'eg', minDigits: 10, maxDigits: 11, example: '10 1234 5678' },
  { code: '+60', name: 'Malaysia', iso: 'my', minDigits: 9, maxDigits: 11, example: '12 345 6789' },
  { code: '+62', name: 'Indonesia', iso: 'id', minDigits: 9, maxDigits: 12, example: '812 3456 7890' },
  { code: '+63', name: 'Philippines', iso: 'ph', minDigits: 10, maxDigits: 11, example: '917 123 4567' },
  { code: '+66', name: 'Thailand', iso: 'th', minDigits: 9, maxDigits: 10, example: '81 234 5678' },
  { code: '+84', name: 'Vietnam', iso: 'vn', minDigits: 9, maxDigits: 10, example: '91 234 5678' },
  { code: '+92', name: 'Pakistan', iso: 'pk', minDigits: 10, maxDigits: 11, example: '300 1234567' },
  { code: '+880', name: 'Bangladesh', iso: 'bd', minDigits: 10, maxDigits: 11, example: '1712 345678' },
  { code: '+977', name: 'Nepal', iso: 'np', minDigits: 10, maxDigits: 10, example: '984 1234567' },
  { code: '+94', name: 'Sri Lanka', iso: 'lk', minDigits: 9, maxDigits: 10, example: '77 123 4567' },
  { code: '+81', name: 'Japan', iso: 'jp', minDigits: 10, maxDigits: 11, example: '90 1234 5678' },
  { code: '+82', name: 'South Korea', iso: 'kr', minDigits: 9, maxDigits: 11, example: '10 1234 5678' },
  { code: '+852', name: 'Hong Kong', iso: 'hk', minDigits: 8, maxDigits: 9, example: '9123 4567' },
  { code: '+86', name: 'China', iso: 'cn', minDigits: 11, maxDigits: 11, example: '138 0013 8000' },
  { code: '+55', name: 'Brazil', iso: 'br', minDigits: 10, maxDigits: 11, example: '11 91234 5678' },
  { code: '+52', name: 'Mexico', iso: 'mx', minDigits: 10, maxDigits: 11, example: '55 1234 5678' },
  { code: '+90', name: 'Turkey', iso: 'tr', minDigits: 10, maxDigits: 10, example: '532 123 4567' },
  { code: '+48', name: 'Poland', iso: 'pl', minDigits: 9, maxDigits: 9, example: '512 345 678' },
  { code: '+351', name: 'Portugal', iso: 'pt', minDigits: 9, maxDigits: 9, example: '912 345 678' },
  { code: '+47', name: 'Norway', iso: 'no', minDigits: 8, maxDigits: 8, example: '412 34 567' },
  { code: '+45', name: 'Denmark', iso: 'dk', minDigits: 8, maxDigits: 8, example: '20 12 34 56' },
  { code: '+32', name: 'Belgium', iso: 'be', minDigits: 9, maxDigits: 9, example: '470 12 34 56' },
  { code: '+43', name: 'Austria', iso: 'at', minDigits: 10, maxDigits: 11, example: '664 1234567' },
  { code: '+972', name: 'Israel', iso: 'il', minDigits: 9, maxDigits: 10, example: '50 123 4567' },
  { code: '+962', name: 'Jordan', iso: 'jo', minDigits: 9, maxDigits: 9, example: '7 9012 3456' },
  { code: '+961', name: 'Lebanon', iso: 'lb', minDigits: 8, maxDigits: 8, example: '70 123 456' },
  { code: '+233', name: 'Ghana', iso: 'gh', minDigits: 9, maxDigits: 10, example: '24 123 4567' },
  { code: '+212', name: 'Morocco', iso: 'ma', minDigits: 9, maxDigits: 9, example: '6 12 34 56 78' },
  { code: '+230', name: 'Mauritius', iso: 'mu', minDigits: 8, maxDigits: 8, example: '5251 2345' },
];

/** Validate full phone string against country dial code and standard rules */
export function validateFullPhone(value: string, selectedCountry?: CountryCode): { isValid: boolean; errorMsg?: string } {
  const clean = value.replace(/\s+/g, '');
  if (!clean) {
    return { isValid: false, errorMsg: 'Phone / WhatsApp number is required.' };
  }

  // Extract digits only
  const digitsOnly = clean.replace(/\D/g, '');

  if (digitsOnly.length < 7) {
    return { isValid: false, errorMsg: 'Phone number is too short (minimum 7 digits).' };
  }
  if (digitsOnly.length > 15) {
    return { isValid: false, errorMsg: 'Phone number is too long (maximum 15 digits according to international standard).' };
  }

  if (selectedCountry) {
    // Strip dial code digits if present at start
    const countryDigits = selectedCountry.code.replace(/\D/g, '');
    let nationalDigits = digitsOnly;
    if (digitsOnly.startsWith(countryDigits)) {
      nationalDigits = digitsOnly.slice(countryDigits.length);
    }

    // Auto-strip leading zero if user entered e.g. 07034595596 with country code selected
    if (nationalDigits.startsWith('0') && nationalDigits.length > selectedCountry.minDigits) {
      nationalDigits = nationalDigits.replace(/^0+/, '');
    }

    if (nationalDigits.length < selectedCountry.minDigits || nationalDigits.length > selectedCountry.maxDigits) {
      const digitLabel = selectedCountry.minDigits === selectedCountry.maxDigits
        ? `${selectedCountry.minDigits}-digit`
        : `${selectedCountry.minDigits}–${selectedCountry.maxDigits} digit`;

      return {
        isValid: false,
        errorMsg: `For ${selectedCountry.name} (${selectedCountry.code}), please enter a valid ${digitLabel} number (e.g. ${selectedCountry.code} ${selectedCountry.example}).`
      };
    }
  }

  return { isValid: true };
}

interface CountryPhoneInputProps {
  value: string;
  onChange: (fullValue: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export default function CountryPhoneInput({
  value,
  onChange,
  placeholder,
  className = '',
  id = 'phone-input',
  required = false
}: CountryPhoneInputProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse initial country from value if present
  const findMatchingCountry = (val: string): CountryCode => {
    const matched = COUNTRY_CODES.find(c => val.startsWith(c.code));
    return matched || COUNTRY_CODES[0];
  };

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(() => findMatchingCountry(value));

  // Extract local portion without dial code
  const getLocalNumber = (fullVal: string, country: CountryCode): string => {
    if (fullVal.startsWith(country.code)) {
      return fullVal.slice(country.code.length).trim();
    }
    return fullVal;
  };

  const [localNumber, setLocalNumber] = useState<string>(() => getLocalNumber(value, selectedCountry));

  // Keep internal state in sync with external value prop
  useEffect(() => {
    const matched = findMatchingCountry(value);
    setSelectedCountry(matched);
    setLocalNumber(getLocalNumber(value, matched));
  }, [value]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    const updatedFull = `${country.code} ${localNumber.trim()}`.trim();
    onChange(updatedFull);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;

    // Check if user pasted an international number starting with +
    if (inputVal.trim().startsWith('+')) {
      const match = COUNTRY_CODES.find(c => inputVal.trim().startsWith(c.code));
      if (match) {
        setSelectedCountry(match);
        inputVal = inputVal.trim().slice(match.code.length).trim();
      }
    }

    // Strip accidental leading zero if user types e.g. 09876543210
    if (inputVal.startsWith('0') && inputVal.length > 1) {
      inputVal = inputVal.replace(/^0+/, '');
    }

    setLocalNumber(inputVal);
    const updatedFull = `${selectedCountry.code} ${inputVal.trim()}`.trim();
    onChange(updatedFull);
  };

  const filteredCountries = COUNTRY_CODES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  });

  const cleanDigits = localNumber.replace(/\D/g, '');
  const validation = validateFullPhone(`${selectedCountry.code} ${localNumber}`, selectedCountry);

  const hasExceeded = cleanDigits.length > selectedCountry.maxDigits;
  const showError = (isTouched || hasExceeded) && cleanDigits.length > 0 && !validation.isValid;
  const showSuccess = validation.isValid && cleanDigits.length >= selectedCountry.minDigits;

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      {/* Container - NO overflow-hidden so popup dropdown will NOT be clipped! */}
      <div
        className={`flex rounded-2xl bg-white transition-all shadow-xs border ${
          showError
            ? 'border-rose-300 ring-1 ring-rose-200'
            : showSuccess
            ? 'border-emerald-300 ring-1 ring-emerald-100'
            : 'border-gray-200 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/30'
        } ${className}`}
      >
        {/* Country Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 hover:bg-slate-100 border-r border-gray-200 text-xs font-mono font-bold text-slate-800 cursor-pointer select-none transition-colors rounded-l-2xl shrink-0"
          title="Click to select country"
        >
          <img
            src={`https://flagcdn.com/20x15/${selectedCountry.iso}.png`}
            alt={selectedCountry.name}
            className="w-5 h-3.5 object-cover rounded-xs shadow-xs shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span>{selectedCountry.code}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
        </button>

        {/* Input Field */}
        <input
          id={id}
          type="tel"
          value={localNumber}
          onChange={handleLocalChange}
          onBlur={() => setIsTouched(true)}
          required={required}
          placeholder={placeholder || `e.g. ${selectedCountry.example}`}
          className="w-full p-3.5 text-sm bg-transparent border-none focus:outline-none font-mono text-slate-800 placeholder:text-slate-400 rounded-r-2xl"
        />

        {showSuccess && (
          <div className="flex items-center pr-3 text-emerald-600 shrink-0">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>

      {/* Floating Dropdown Menu (Z-index high, outside overflow-hidden) */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-80 max-w-[95vw] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-gold/40 z-[99999] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-2.5 bg-slate-50 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 focus-within:border-gold">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code (e.g. US, UK, UAE)..."
                className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="px-2 pt-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              <span>Select Your Country</span>
              <span>{filteredCountries.length} countries</span>
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 modal-scroll-area">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No country found matching "{searchQuery}"
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code && c.iso === selectedCountry.iso;
                return (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-gold/10 transition-colors cursor-pointer text-xs ${
                      isSelected ? 'bg-gold/15 font-bold text-primary' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={`https://flagcdn.com/20x15/${c.iso}.png`}
                        alt={c.name}
                        className="w-5 h-3.5 object-cover rounded-xs shadow-xs shrink-0"
                      />
                      <span className="truncate font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{c.code}</span>
                      {isSelected && <Check size={14} className="text-gold shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Validation feedback */}
      {showError && (
        <p className="text-[11px] text-rose-500 font-mono flex items-center gap-1 pl-1">
          <span>⚠️ {validation.errorMsg}</span>
        </p>
      )}

      {showSuccess && (
        <p className="text-[11px] text-emerald-600 font-mono flex items-center gap-1 pl-1">
          <span>✓ Valid number for {selectedCountry.name} ({selectedCountry.code})</span>
        </p>
      )}
    </div>
  );
}
