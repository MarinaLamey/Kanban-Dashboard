import KanbanBoard from '../../componant/kanban/KanbanBoard';
import { Box, Typography } from '@mui/material';

/**
 * Main Page - Kanban Application
 * High-performance task management board
 */
export default function Home() {
  return (
    <main style={{  minHeight: '100vh' }}>
      {/* Container for the whole application view */}
      <Box sx={{ py: 2 }}>
        <KanbanBoard />
      </Box>
    </main>
  );
}