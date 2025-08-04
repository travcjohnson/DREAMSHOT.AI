import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, originalPrompt, category, tags = [], isPublic = false } = body;

    // Validate required fields
    if (!title || !description || !originalPrompt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, just return a mock success response
    const dream = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      originalPrompt,
      category,
      tags,
      isPublic,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(dream, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dream:', error);
    return NextResponse.json(
      { error: 'Failed to create dream' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return mock dreams for now
  const mockDreams = [
    {
      id: '1',
      title: 'AI-Powered Recipe Generator',
      description: 'Create a system that generates personalized recipes based on dietary restrictions, available ingredients, and taste preferences.',
      originalPrompt: 'Build an AI that can create recipes from whatever I have in my fridge',
      category: 'TECHNOLOGY',
      tags: ['AI', 'food', 'recipes'],
      isPublic: true,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
  ];

  return NextResponse.json(mockDreams);
}