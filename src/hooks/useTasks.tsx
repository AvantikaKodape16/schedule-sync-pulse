
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export interface DatabaseTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<DatabaseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...taskData,
            user_id: user.id,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        toast.error('Failed to create task');
      } else {
        setTasks([data, ...tasks]);
        toast.success('Task created successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const updateTask = async (id: string, updates: Partial<DatabaseTask>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
      } else {
        setTasks(tasks.map(task => task.id === id ? data : task));
        toast.success('Task updated successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      } else {
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
