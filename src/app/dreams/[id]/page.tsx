import { notFound } from 'next/navigation';

// Mock dream data for now
const mockDreams = new Map([
  ['1', {
    id: '1',
    title: 'AI-Powered Recipe Generator',
    description: 'Create a system that generates personalized recipes based on dietary restrictions, available ingredients, and taste preferences.',
    originalPrompt: 'Build an AI that can create recipes from whatever I have in my fridge',
    category: 'TECHNOLOGY',
    tags: ['AI', 'food', 'recipes'],
    isPublic: true,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }]
]);

async function getDream(id: string) {
  // For now, return a mock dream or the one from memory
  return mockDreams.get(id) || {
    id,
    title: 'Your Dream',
    description: 'Dream submitted successfully!',
    originalPrompt: 'This is a placeholder for your submitted dream.',
    category: 'PERSONAL',
    tags: [],
    isPublic: false,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
}

interface DreamPageProps {
  params: Promise<{ id: string }>;
}

export default async function DreamPage({ params }: DreamPageProps) {
  const { id } = await params;
  const dream = await getDream(id);

  if (!dream) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {dream.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {dream.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {dream.status}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted {new Date(dream.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {dream.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Original Prompt
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-800 font-mono text-sm leading-relaxed">
                    {dream.originalPrompt}
                  </p>
                </div>
              </div>

              {dream.tags && dream.tags.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {dream.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🚀 Dream Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your impossible dream is now being tracked. We&apos;ll monitor AI progress and notify you when breakthrough moments happen!
                </p>
                <div className="text-sm text-gray-500">
                  <p>✨ AI evaluation coming soon</p>
                  <p>📈 Progress tracking enabled</p>
                  <p>🔔 Breakthrough notifications ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}