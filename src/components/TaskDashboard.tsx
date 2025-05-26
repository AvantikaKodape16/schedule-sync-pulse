
import React, { useState, useMemo } from 'react';
import { Task, FilterOptions, SortOption, TaskType } from '../types/task';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, ListTodo, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Sample data
const generateSampleTasks = (): Task[] => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      dateCreated: '2024-01-15',
      entityName: 'Acme Corporation',
      taskType: 'Meeting',
      scheduledTime: '2024-01-20T10:00',
      contactPerson: 'John Smith',
      note: 'Discuss project requirements and timeline',
      status: 'open'
    },
    {
      id: '2',
      dateCreated: '2024-01-16',
      entityName: 'Tech Solutions Inc',
      taskType: 'Call',
      scheduledTime: '2024-01-18T14:30',
      contactPerson: 'Sarah Johnson',
      note: 'Follow up on proposal submission',
      status: 'closed'
    },
    {
      id: '3',
      dateCreated: '2024-01-17',
      entityName: 'Global Enterprises',
      taskType: 'Email',
      scheduledTime: '2024-01-19T09:00',
      contactPerson: 'Mike Chen',
      note: '',
      status: 'open'
    },
    {
      id: '4',
      dateCreated: '2024-01-18',
      entityName: 'StartUp Hub',
      taskType: 'Presentation',
      scheduledTime: '2024-01-25T15:00',
      contactPerson: 'Emily Davis',
      note: 'Present new service offerings',
      status: 'open'
    },
    {
      id: '5',
      dateCreated: '2024-01-19',
      entityName: 'Innovation Labs',
      taskType: 'Follow-up',
      scheduledTime: '2024-01-22T11:00',
      contactPerson: 'David Wilson',
      note: 'Check on project progress',
      status: 'open'
    }
  ];
  return sampleTasks;
};

export const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(generateSampleTasks());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('scheduledTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const teamMembers = Array.from(new Set(tasks.map(task => task.contactPerson))).sort();

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (filters.taskType && task.taskType !== filters.taskType) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.contactPerson && task.contactPerson !== filters.contactPerson) return false;
      if (filters.entityName && !task.entityName.toLowerCase().includes(filters.entityName.toLowerCase())) return false;
      
      if (filters.dateRange?.start || filters.dateRange?.end) {
        const taskDate = new Date(task.scheduledTime);
        if (filters.dateRange.start && taskDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && taskDate > new Date(filters.dateRange.end + 'T23:59:59')) return false;
      }
      
      return true;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'dateCreated' || sortBy === 'scheduledTime') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, filters, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const open = tasks.filter(t => t.status === 'open').length;
    const closed = tasks.filter(t => t.status === 'closed').length;
    const overdue = tasks.filter(t => 
      t.status === 'open' && new Date(t.scheduledTime) < new Date()
    ).length;

    return { total, open, closed, overdue };
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks([...tasks, newTask]);
    setIsCreateDialogOpen(false);
    toast.success('Task created successfully!');
  };

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    
    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id ? { ...taskData, id: editingTask.id } : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (taskId: string, newStatus: 'open' | 'closed') => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast.success(`Task marked as ${newStatus}!`);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ListTodo className="h-8 w-8" />
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track your team's tasks efficiently
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ListTodo className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onFiltersChange={setFilters}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
        onClearFilters={handleClearFilters}
        teamMembers={teamMembers}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Badge variant="outline">
            {filteredAndSortedTasks.length} of {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAndSortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredAndSortedTasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ListTodo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {tasks.length === 0 
                ? "Get started by creating your first task!"
                : "Try adjusting your filters to see more tasks."
              }
            </p>
            {tasks.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Task
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              initialTask={editingTask}
              isEditing={true}
              onSubmit={handleEditTask}
              onCancel={() => setEditingTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
