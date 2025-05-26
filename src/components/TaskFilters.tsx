
import React from 'react';
import { FilterOptions, SortOption, TaskType } from '../types/task';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Filter, ArrowUpDown, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: FilterOptions;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sortBy: SortOption, sortOrder: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  teamMembers: string[];
}

const taskTypes: TaskType[] = [
  'Meeting', 'Call', 'Email', 'Follow-up', 'Presentation', 'Documentation', 'Review', 'Other'
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'scheduledTime', label: 'Scheduled Time' },
  { value: 'dateCreated', label: 'Date Created' },
  { value: 'entityName', label: 'Entity Name' },
  { value: 'taskType', label: 'Task Type' },
  { value: 'contactPerson', label: 'Contact Person' },
  { value: 'status', label: 'Status' }
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  sortBy,
  sortOrder,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  teamMembers
}) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && 
    (typeof value !== 'object' || Object.values(value).some(v => v !== ''))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select
              value={filters.taskType || ''}
              onValueChange={(value: TaskType | '') => 
                onFiltersChange({ ...filters, taskType: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                {taskTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value: 'open' | 'closed' | '') => 
                onFiltersChange({ ...filters, status: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contact Person</Label>
            <Select
              value={filters.contactPerson || ''}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, contactPerson: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All members</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Entity Name</Label>
            <Input
              placeholder="Search entity..."
              value={filters.entityName || ''}
              onChange={(e) => 
                onFiltersChange({ ...filters, entityName: e.target.value || undefined })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort By
            </Label>
            <div className="flex gap-1">
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => onSortChange(value, sortOrder)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date Range - Start</Label>
            <Input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => 
                onFiltersChange({ 
                  ...filters, 
                  dateRange: { 
                    start: e.target.value, 
                    end: filters.dateRange?.end || '' 
                  } 
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Date Range - End</Label>
            <Input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => 
                onFiltersChange({ 
                  ...filters, 
                  dateRange: { 
                    start: filters.dateRange?.start || '', 
                    end: e.target.value 
                  } 
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
