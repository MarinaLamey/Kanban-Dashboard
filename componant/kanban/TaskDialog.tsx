'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { Task } from '@/types/task';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  task?: Task | Partial<Task> | null; 
}

export default function TaskDialog({ open, onClose, onSave, task }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      const isEdit = task && 'id' in task;
      setTitle(isEdit ? (task as Task).title : '');
      setDescription(isEdit ? (task as Task).description : '');
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#12141C', color: 'white', borderRadius: '24px', minWidth: '400px' } }}>
      <DialogTitle sx={{ fontWeight: 900, color: '#FF3B3B' }}>
        {task && 'id' in task ? 'Edit Task' : 'New Task'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={inputStyles} />
          <TextField fullWidth label="Description" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} sx={inputStyles} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#FF3B3B' }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

const inputStyles = {
  '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
};