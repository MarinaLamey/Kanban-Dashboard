'use client';
import { useState } from 'react';
import { Box, Stack, Button } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
// 1. Import AnimatePresence
import { AnimatePresence } from 'framer-motion'; 

import TaskCard from './TaskCard';
import Pagination from '../pagination/Pagination';
import { Task, ColumnType } from '@/types/task';

interface ColumnProps {
  title: string;
  type: ColumnType;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (data: Task | Partial<Task>) => void;
}

export default function Column({ title, type, tasks, onDelete, onEdit }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: type });
  
  // Isolated pagination state per column
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  
  // Derive the paginated subset
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * tasksPerPage, 
    currentPage * tasksPerPage
  );

  const taskIds = paginatedTasks.map(t => t.id);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        p: 2,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease', // Smooth aesthetic transitions
        bgcolor: '#12141C',
        // Interactive Red Glow effect
        boxShadow: isOver 
          ? '0px 0px 25px 5px rgba(255, 59, 59, 0.4)' 
          : '0px 10px 30px -5px rgba(255, 59, 59, 0.15)',
        border: isOver ? '1px solid #FF3B3B' : '1px solid rgba(255, 59, 59, 0.08)',
      }}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Stack spacing={2} sx={{ flexGrow: 1, mb: 3, position: 'relative' }}>
          {/* 2. Wrap the dynamic list in AnimatePresence */}
          <AnimatePresence initial={false}> 
            {paginatedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </AnimatePresence>
          
          {/* Empty state placeholder */}
          {tasks.length === 0 && (
             <Box sx={{ height: 100, border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '16px' }} />
          )}
        </Stack>
      </SortableContext>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination 
          pageN={currentPage} 
          pages={totalPages} 
          onChange={(page) => setCurrentPage(page)} 
        />
      )}

      <Button
        fullWidth
        startIcon={<AddIcon />}
        onClick={() => onEdit({ column: type })}
        sx={{ mt: 2, py: 1.5, borderRadius: '16px', color: 'rgba(255,255,255,0.4)', border: '1px dashed rgba(255,255,255,0.1)', fontWeight: 700 }}
      >
        Add Task
      </Button>
    </Box>
  );
}