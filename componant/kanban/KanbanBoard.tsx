'use client';

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { 
  Container, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress, 
  InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

// 1. Import motion and Variants interface for strict typing
import { motion, Variants } from 'framer-motion'; 

import { useTasks } from '@/hooks/useTasks';
import Column from './Column';
import TaskDialog from './TaskDialog';
import { ColumnType, Task } from '@/types/task';

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

// --- 2. Animation Variants (Explicitly typed as Variants to satisfy TS) ---

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20, 
      delay: 0.1 
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.12, 
      delayChildren: 0.3 
    }
  }
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function KanbanBoard() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | Partial<Task> | null>(null);

  const { allTasks, isLoading, deleteTask, updateTask, createTask } = useTasks(searchQuery);

  // Hydration fix for Next.js 15/16
  useEffect(() => { setMounted(true); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleOpenDialog = (data: Task | Partial<Task>) => {
    setTaskToEdit(data);
    setIsDialogOpen(true);
  };

  const handleSaveTask = async (formData: { title: string; description: string }) => {
    try {
      if (taskToEdit && 'id' in taskToEdit) {
        await updateTask({ ...taskToEdit, ...formData } as Task);
      } else {
        const targetColumn = (taskToEdit as Partial<Task>)?.column || 'backlog';
        await createTask({ ...formData, column: targetColumn });
      }
      setIsDialogOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error("API Sync Error:", err);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = allTasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const overColumn = COLUMNS.find(col => col.id === overId);
    const overTask = allTasks.find(t => t.id === overId);
    const newColumn = (overColumn ? overColumn.id : overTask?.column) as ColumnType;

    if (newColumn && activeTask.column !== newColumn) {
      updateTask({ ...activeTask, column: newColumn });
    }
  };

  if (!mounted) return null;

  return (
    <Box sx={{ bgcolor: '#0A0B0E', minHeight: '100vh', py: 6, color: '#FFFFFF' }}>
      <Container maxWidth="xl">
        
        {/* Animated Header: Slides in from the left */}
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={headerVariants}
        >
          <Box sx={{ 
            mb: 8, display: 'flex', alignItems: 'center', gap: 3, p: 4, 
            bgcolor: '#12141C', borderRadius: '28px', border: '1px solid rgba(255, 59, 59, 0.1)' 
          }}>
            <DashboardCustomizeIcon sx={{ fontSize: 32, color: '#FF3B3B' }} />
            <Typography variant="h4" fontWeight="900">Kanban Board</Typography>
          </Box>
        </motion.div>

        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Filter your tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 7, maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#12141C', color: 'white' }}}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#FF3B3B' }} /></InputAdornment> }}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF3B3B' }} />
          </Box>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            {/* Animated Columns Container: Controls the stagger timing for children */}
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={containerVariants}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
                {COLUMNS.map((col) => (
                  /* Individual Column Wrapper: Inherits animate/initial from Parent motion.div */
                  <motion.div 
                    key={col.id} 
                    variants={columnVariants}
                    style={{ flex: 1, minWidth: '320px' }}
                  >
                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#FF3B3B', mb: 3, px: 1 }}>
                      {col.title.toUpperCase()}
                    </Typography>
                    <Column
                      title={col.title}
                      type={col.id}
                      tasks={allTasks.filter(t => t.column === col.id)}
                      onDelete={deleteTask}
                      onEdit={handleOpenDialog}
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </DndContext>
        )}

        <TaskDialog 
          open={isDialogOpen} 
          task={taskToEdit} 
          onClose={() => { setIsDialogOpen(false); setTaskToEdit(null); }} 
          onSave={handleSaveTask} 
        />
      </Container>
    </Box>
  );
}