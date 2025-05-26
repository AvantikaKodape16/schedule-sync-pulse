
import React from 'react';
import { Task } from '../types/task';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  Type, 
  FileText, 
  Edit, 
  Trash2,
  CheckCircle,
  Circle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: 'open' | 'closed') => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskTypeColor = (taskType: string) => {
    const colors = {
      'Meeting': 'bg-blue-100 text-blue-800',
      'Call': 'bg-green-100 text-green-800',
      'Email': 'bg-purple-100 text-purple-800',
      'Follow-up': 'bg-orange-100 text-orange-800',
      'Presentation': 'bg-red-100 text-red-800',
      'Documentation': 'bg-yellow-100 text-yellow-800',
      'Review': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[taskType as keyof typeof colors] || colors.Other;
  };

  const isOverdue = new Date(task.scheduledTime) < new Date() && task.status === 'open';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.status === 'closed' && "opacity-75",
      isOverdue && "border-red-200 bg-red-50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(task.id, task.status === 'open' ? 'closed' : 'open')}
              className="p-1 h-auto"
            >
              {task.status === 'closed' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </Button>
            <div>
              <Badge className={getTaskTypeColor(task.taskType)}>
                {task.taskType}
              </Badge>
              {task.status === 'closed' && (
                <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                  Completed
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive" className="ml-2">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="p-2 h-auto"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="p-2 h-auto text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{task.entityName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span>{task.contactPerson}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(task.dateCreated)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className={cn(
              isOverdue && "text-red-600 font-medium"
            )}>
              Due: {formatDateTime(task.scheduledTime)}
            </span>
          </div>
        </div>
        
        {task.note && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-gray-600">{task.note}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
