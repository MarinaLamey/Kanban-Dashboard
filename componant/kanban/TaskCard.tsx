'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Typography, Box, Chip, IconButton, Stack } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Task } from '@/types/task';
// 1. Import motion
import { motion } from 'framer-motion'; 

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

// 2. Create a motion-enabled MUI Card component
const MotionCard = motion(Card);

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition: dndTransition, // Rename dnd-kit transition to avoid conflict
    isDragging
  } = useSortable({ id: task.id });

  // dnd-kit styles for dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: dndTransition,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <MotionCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // Crucial for dnd-kit dragging
      
      // 3. Framer Motion Animations
      layout // Automagically animates position changes (reordering/filtering)
      initial={{ opacity: 0, y: 20, scale: 0.95 }} // Entry animation state
      animate={{ opacity: isDragging ? 0.3 : 1, y: 0, scale: 1 }} // Normal/Dragging animation state
      exit={{ opacity: 0, scale: 0.8, x: -100, transition: { duration: 0.2 } }} // Exit animation (on delete)
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // Hover interaction
      
      // Animation transition configuration (using spring for natural feel)
      transition={{
        layout: { type: "spring", stiffness: 500, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}

      // MUI Styles
      sx={{
        bgcolor: '#12141C',
        p: 2.5,
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: isDragging ? 1000 : 1, // Keep dragged card on top
        // Important: transition must not include layout-affecting properties
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease', 
        '&:hover': {
          borderColor: 'rgba(255, 59, 59, 0.3)',
          boxShadow: '0px 5px 15px rgba(255, 59, 59, 0.1)'
        }
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
          {task.title}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip 
            label={task.column.replace('_', ' ')} 
            size="small" 
            sx={{ bgcolor: 'rgba(255,59,59,0.1)', color: '#FF3B3B', fontWeight: 800, fontSize: '0.7rem' }} 
          />
          
          <Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(task); }} sx={{ color: 'rgba(255,255,255,0.3)' }}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} sx={{ color: 'rgba(255,59,59,0.5)' }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Stack>
    </MotionCard>
  );
}