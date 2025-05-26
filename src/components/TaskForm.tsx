
import React, { useState } from 'react';
import { Task, TaskType } from '../types/task';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, Clock, User, Building, Type, FileText } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialTask?: Task;
  isEditing?: boolean;
  onCancel?: () => void;
}

const taskTypes: TaskType[] = [
  'Meeting', 'Call', 'Email', 'Follow-up', 'Presentation', 'Documentation', 'Review', 'Other'
];

const teamMembers = [
  'John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'David Wilson',
  'Lisa Anderson', 'Tom Brown', 'Amy Taylor', 'Chris Martin', 'Jessica Lee'
];

export const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  initialTask, 
  isEditing = false, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    dateCreated: initialTask?.dateCreated || new Date().toISOString().split('T')[0],
    entityName: initialTask?.entityName || '',
    taskType: initialTask?.taskType || '' as TaskType,
    scheduledTime: initialTask?.scheduledTime || '',
    contactPerson: initialTask?.contactPerson || '',
    note: initialTask?.note || '',
    status: initialTask?.status || 'open' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.entityName || !formData.taskType || !formData.scheduledTime || !formData.contactPerson) {
      return;
    }

    onSubmit({
      dateCreated: formData.dateCreated,
      entityName: formData.entityName,
      taskType: formData.taskType,
      scheduledTime: formData.scheduledTime,
      contactPerson: formData.contactPerson,
      note: formData.note,
      status: formData.status
    });

    if (!isEditing) {
      setFormData({
        dateCreated: new Date().toISOString().split('T')[0],
        entityName: '',
        taskType: '' as TaskType,
        scheduledTime: '',
        contactPerson: '',
        note: '',
        status: 'open'
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateCreated" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Created
              </Label>
              <Input
                id="dateCreated"
                type="date"
                value={formData.dateCreated}
                onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entityName" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Entity Name (Customer)
              </Label>
              <Input
                id="entityName"
                placeholder="Enter customer/entity name"
                value={formData.entityName}
                onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Task Type
              </Label>
              <Select
                value={formData.taskType}
                onValueChange={(value: TaskType) => setFormData({ ...formData, taskType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Scheduled Time
              </Label>
              <Input
                id="scheduledTime"
                type="datetime-local"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Person (Team Member)
            </Label>
            <Select
              value={formData.contactPerson}
              onValueChange={(value) => setFormData({ ...formData, contactPerson: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'open' | 'closed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any additional notes..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
