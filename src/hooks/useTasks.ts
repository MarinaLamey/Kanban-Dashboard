'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '@/types/task';
import { useMemo } from 'react';

const API_URL = 'http://localhost:3001/tasks';

export const useTasks = (searchQuery: string = '') => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get<Task[]>(API_URL);
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const filteredTasks = useMemo(() => {
    if (!data) return [];
    let results = data.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return [...results].reverse(); 
  }, [data, searchQuery]);

  //  Optimized Mutation for Drag & Drop 
  const updateTask = useMutation({
    mutationFn: (updated: Task) => axios.put(`${API_URL}/${updated.id}`, updated),
    
    // Step 1: When mutate is called
    onMutate: async (updatedTask) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value for rollback if things go south
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the cache immediately
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return [];
        return old.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
      });

      // Return context object with the snapshotted value
      return { previousTasks };
    },

    // Step 2: If the mutation fails, use the context we returned above
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
        console.error("Rollback triggered due to API error:", err);
      }
    },

    // Step 3: Always refetch after error or success to keep server/client in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // --- Standard Mutations (Create/Delete) ---
  const createTask = useMutation({
    mutationFn: (newTask: Omit<Task, 'id'>) => axios.post(API_URL, newTask),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  // Inside useTasks hook

const deleteTask = useMutation({
  mutationFn: (id: string) => axios.delete(`${API_URL}/${id}`),

  // 1. Instant Feedback: Remove the task from UI immediately
  onMutate: async (deletedId) => {
    // Cancel ongoing fetches to prevent data sync issues
    await queryClient.cancelQueries({ queryKey: ['tasks'] });

    // Snapshot the current state before deletion
    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

    // Optimistically update the cache: Filter out the deleted task
    queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
      if (!old) return [];
      return old.filter((task) => task.id !== deletedId);
    });

    // Return the snapshot for potential rollback
    return { previousTasks };
  },

  // 2. Error Handling: If the server fails to delete, bring the task back
  onError: (err, deletedId, context) => {
    if (context?.previousTasks) {
      queryClient.setQueryData(['tasks'], context.previousTasks);
      console.error("Delete failed, task restored:", err);
    }
  },

  // 3. Final Sync: Ensure client and server are perfectly aligned
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

  return {
    allTasks: filteredTasks,
    isLoading,
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync, // Now lightning fast
    deleteTask: deleteTask.mutate,
  };
};