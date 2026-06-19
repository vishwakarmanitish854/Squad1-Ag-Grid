import { useState } from 'react';
import type { GridFilters } from '../types/index';
import '../styles/filter-panel.css';

interface FilterPanelProps {
  filters: GridFilters;
  onFiltersChange: (filters: GridFilters) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function FilterPanel({ filters, onFiltersChange, onReset, activeFilterCount }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof GridFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <div className="filter-panel">
      <button
        className="filter-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <svg className="filter-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 6h10M4 12h16M6 18h12" />
        </svg>
        Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-group">
            <label htmlFor="search-filter">Search</label>
            <input
              id="search-filter"
              type="text"
              placeholder="Employee name, code, or ID"
              value={filters.searchText || ''}
              onChange={(e) => handleChange('searchText', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="department-filter">Department</label>
            <select
              id="department-filter"
              value={filters.Department || ''}
              onChange={(e) => handleChange('Department', e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={filters.Status || ''}
              onChange={(e) => handleChange('Status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={onReset} className="filter-reset-btn">
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
