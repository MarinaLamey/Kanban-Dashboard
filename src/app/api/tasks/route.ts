import { NextResponse } from 'next/server';
import { Task } from '@/types/task';

// This routs to can api work in vercel
 export let tasks: Task[] = [
  { id: "1", title: "Review Assessment", description: "Check Marina's high-performance code.", column: "backlog" },
  { id: "2", title: "Verify DnD Logic", description: "Test the 60FPS fluidity with dnd-kit.", column: "in_progress" },
  { id: "3", title: "Check Optimistic Updates", description: "Verify zero-latency feedback using TanStack Query.", column: "review" },
  { id: "4", title: "Hire Marina", description: "Excellent engineering and UX skills.", column: "done" },
];



export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTask: Task = {
    ...body,
    id: Math.random().toString(36).substring(2, 11),
  };
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}