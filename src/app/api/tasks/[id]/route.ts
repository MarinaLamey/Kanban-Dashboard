import { NextResponse, NextRequest } from 'next/server';
import { tasks } from '../route'; 

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before accessing 'id'
    const { id } = await params;
    const body = await request.json();
    // use find Index(map until find the ind) faster than filter 
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...body };
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const { id } = await params;
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks.splice(taskIndex, 1);
    return NextResponse.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}