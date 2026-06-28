import { useState, type ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { MagnifyingGlass, CaretDown, CalendarBlank } from '@phosphor-icons/react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterLabel: string;
  filterOptions: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  dateLabel?: string;
  dateOptions?: FilterOption[];
  activeDate?: string;
  onDateChange?: (value: string) => void;
  onDatePick?: (date: string) => void;
  dateValue?: string;
}

export function FilterBar({
  searchPlaceholder = 'Search',
  onSearch,
  filterLabel,
  filterOptions,
  activeFilter,
  onFilterChange,
  dateLabel = 'Today',
  dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'All Time', value: 'all' },
  ],
  activeDate = 'today',
  onDateChange,
  onDatePick,
  dateValue,
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Search */}
      <div className="w-56 p-2 bg-neutral-50 rounded-3xl outline outline-offset-[-1px] outline-black/5 flex justify-between items-center">
        <div className="flex justify-start items-center gap-1.5">
          <MagnifyingGlass size={14} className="text-black/40" weight="duotone" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
            className="text-black/40 text-sm bg-transparent outline-none w-full placeholder:text-black/40"
          />
        </div>
      </div>

      {/* Status/type filter */}
      <FilterDropdown
        label={filterLabel}
        options={filterOptions}
        active={activeFilter}
        onChange={onFilterChange}
      />

      {/* Date picker or date dropdown */}
      {onDatePick ? (
        <div className="relative">
          <div className="p-2.5 bg-neutral-50 rounded-full outline-offset-[-1px] outline-black/5 flex items-center gap-2 cursor-pointer">
            <CalendarBlank size={14} className="text-black/40" weight="duotone" />
            <input
              type="date"
              value={dateValue || ''}
              onChange={(e) => onDatePick(e.target.value)}
              className="text-black text-xs bg-transparent outline-none w-28 [color-scheme:light]"
            />
          </div>
        </div>
      ) : (
        onDateChange && (
          <FilterDropdown
            label={dateOptions.find(o => o.value === activeDate)?.label || dateLabel}
            options={dateOptions}
            active={activeDate}
            onChange={onDateChange}
            compact
          />
        )
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  active,
  onChange,
  compact,
}: {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'p-2.5 bg-neutral-50 rounded-full outline-1 outline-offset-[-1px] outline-black/5 flex justify-between items-center gap-2',
          compact ? 'w-28' : 'w-40'
        )}
      >
        <span className="text-black text-xs">{label}</span>
        <CaretDown size={14} className="text-black/60" weight="duotone" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={clsx(
                'w-full text-left px-3 py-2 text-xs transition-colors',
                active === opt.value
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-black/70 hover:bg-gray-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const DEFAULT_DATE_OPTIONS: FilterOption[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
];
