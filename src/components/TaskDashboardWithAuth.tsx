
import React, { useState } from 'react';
import { useTasks, DatabaseTask } from '../hooks/useTasks';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, ListTodo, CheckCircle, Clock, AlertTriangle, LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SimpleTaskForm: React.FC<{
  onSubmit: (data: { title: string; description?: string; due_date?: string }) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Create Task</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

const TaskCard: React.FC<{
  task: DatabaseTask;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}> = ({ task, onUpdateStatus, onDelete }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
  
  return (
    <Card className={`transition-all ${task.status === 'completed' ? 'opacity-75' : ''} ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateStatus(task.id, task.status === 'pending' ? 'completed' : 'pending')}
              className="p-1 h-auto"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400" />
              )}
            </Button>
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.status === 'completed' && (
                <Badge variant="outline" className="text-green-600 border-green-600 mt-1">
                  Completed
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive" className="mt-1">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="p-2 h-auto text-red-600 hover:text-red-700"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
          {task.due_date && (
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TaskDashboardWithAuth: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully!');
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => 
      t.status === 'pending' && t.due_date && new Date(t.due_date) < new Date()
    ).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

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
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <SimpleTaskForm 
                onSubmit={createTask} 
                onClose={() => setIsCreateDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
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
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
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

      {/* Tasks List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <Badge variant="outline">{tasks.length} tasks</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={(id, status) => updateTask(id, { status })}
              onDelete={deleteTask}
            />
          ))}
        </div>

        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <ListTodo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first task!
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
