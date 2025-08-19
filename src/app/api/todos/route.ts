import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' }, 
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json()
    
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' }, 
        { status: 400 }
      )
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim()
      }
    })
    
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Failed to create todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' }, 
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, done, title } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' }, 
        { status: 400 }
      )
    }

    const updateData: { done?: boolean; title?: string } = {}
    if (typeof done === 'boolean') updateData.done = done
    if (title?.trim()) updateData.title = title.trim()

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(todo)
  } catch (error) {
    console.error('Failed to update todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const deleteAll = url.searchParams.get('all')
    
    // Jika ada parameter ?all=true, hapus semua data
    if (deleteAll === 'true') {
      const result = await prisma.todo.deleteMany({})
      return NextResponse.json({ 
        success: true, 
        deletedCount: result.count,
        message: `Successfully deleted ${result.count} todos` 
      })
    }
    
    // Jika tidak ada parameter all, lakukan delete single seperti biasa
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for single delete, or use ?all=true to delete all' }, 
        { status: 400 }
      )
    }

    await prisma.todo.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete todo(s):', error)
    return NextResponse.json(
      { error: 'Failed to delete todo(s)' }, 
      { status: 500 }
    )
  }
}