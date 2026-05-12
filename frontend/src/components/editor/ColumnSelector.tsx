import React from 'react';

interface ColumnOption {
  id: string;
  name: string;
  description?: string;
}

export interface ColumnSelectorProps {
  value?: string;
  onChange: (columnId: string | undefined) => void;
  columns?: ColumnOption[];
  isDisabled?: boolean;
  className?: string;
}

export function ColumnSelector({
  value,
  onChange,
  columns = [],
  isDisabled = false,
  className,
}: ColumnSelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Column (Optional)
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={isDisabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">No column</option>
        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            {column.name}
            {column.description && ` - ${column.description}`}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-400">
        Assign this article to a column for better organization
      </p>
    </div>
  );
}

export default ColumnSelector;