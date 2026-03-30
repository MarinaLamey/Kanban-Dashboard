'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '@/types/task';
import { useMemo } from 'react';

/**
 * 
 * Switches between local json-server and Next.js API to can deployment.
 */
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/tasks' 
  : '/api/tasks';

export const useTasks = (searchQuery: string = '') => {
  const queryClient = useQueryClient();

  // Fetching all tasks with React Query
  const { data, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get<Task[]>(API_URL);
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Optimized client-side filtering for 1ms request  
  const filteredTasks = useMemo(() => {
    if (!data) return [];
    const results = data.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return [...results].reverse(); // Show newest tasks first
  }, [data, searchQuery]);


  // CREATE Task with Optimistic UI
  const createTask = useMutation({
    mutationFn: (newTask: Omit<Task, 'id'>) => axios.post(API_URL, newTask),
    
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Create a temporary task object to show snap shot 
      const optimisticTask = { 
        ...newTask, 
        id: Math.random().toString(36).substring(2, 9) // Temporary ID
      };

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return old ? [optimisticTask, ...old] : [optimisticTask];
      });

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // UPDATE Task (Handles Drag & Drop + Editing) with Optimistic UI
  const updateTask = useMutation({
    mutationFn: (updated: Task) => axios.put(`${API_URL}/${updated.id}`, updated),
    
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return [];
        return old.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
      });

      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // DELETE Task with Optimistic UI
  const deleteTask = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_URL}/${id}`),

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return [];
        return old.filter((task) => task.id !== deletedId);
      });

      return { previousTasks };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    allTasks: filteredTasks,
    isLoading,
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    deleteTask: deleteTask.mutate,
  };
};