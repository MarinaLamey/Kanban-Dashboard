'use client';
import Link from "next/link";
import { Pagination as MuiPagination, PaginationItem, Box } from "@mui/material";

interface PaginationProps {
  pageN: number;
  route?: string; 
  pages: number;
  onChange?: (page: number) => void; 
}

const Pagination = ({ pageN, route, pages, onChange }: PaginationProps) => {
  const connector = route?.includes('/search') ? '&' : '?';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
      <MuiPagination
        page={pageN}
        count={pages}
        variant="outlined"
        shape="rounded"
        // Callback for internal state updates (used in Kanban columns)
        onChange={(_, page) => onChange && onChange(page)}
        renderItem={(item) => (
          <PaginationItem
            // Switch between Next.js Link or button based on navigation strategy
            component={route && route !== "#" ? Link : 'button'}
            href={route && route !== "#" ? `${route}${connector}pageNumber=${item.page}` : undefined}
            {...item}
            // Aesthetic formatting for single digits (e.g., 01, 02)
            page={item.page && item.page < 10 ? `0${item.page}` : item.page}
            sx={{
              color: '#FFFFFF',
              opacity: 0.7,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontFamily: "'Oswald', sans-serif",
              '&.Mui-selected': {
                bgcolor: '#FF3B3B !important',
                color: '#FFFFFF',
                opacity: 1,
              },
              '&:hover': {
                bgcolor: 'rgba(255, 59, 59, 0.1)',
                borderColor: '#FF3B3B',
              }
            }}
          />
        )}
      />
    </Box>
  );
}

export default Pagination;