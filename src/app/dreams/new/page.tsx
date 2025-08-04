'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DreamSubmissionForm } from '@/components/forms/dream-submission-form';

interface DreamFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

export default function NewDreamPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: DreamFormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call to create the dream
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          originalPrompt: formData.description, // For now, use description as original prompt
          category: formData.category,
          tags: formData.tags,
          isPublic: formData.isPublic,
        }),
      });

      if (response.ok) {
        const dream = await response.json();
        // Redirect to the dream's page or dashboard
        router.push(`/dreams/${dream.id}`);
      } else {
        throw new Error('Failed to create dream');
      }
    } catch (error) {
      console.error('Error creating dream:', error);
      // You could add toast notifications here
      alert('Failed to create dream. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            DREAMSHOT.AI
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            New Dream Submission
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <DreamSubmissionForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 mt-16">
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Ready to make the impossible possible? DREAMSHOT.AI is here to help.</p>
        </div>
      </footer>
    </div>
  );
}