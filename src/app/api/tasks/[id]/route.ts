import { NextResponse } from 'next/server';
// We import the tasks array to perform lookups and deletions
import { tasks } from '../route'; 

/**
 * UPDATE Task
 * Handles updating the column darg and drop task  or task details (title/description)
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Find the task index in our in-memory store
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update the task in the array 
    tasks[taskIndex] = { ...tasks[taskIndex], ...body };

    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

/**
 * dELETE Task
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Remove the task from the array
    tasks.splice(taskIndex, 1);

    return NextResponse.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}