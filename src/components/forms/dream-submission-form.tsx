'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Dream category types with emotional descriptions
type DreamCategory = {
  id: 'CREATIVE' | 'TECHNOLOGY' | 'BUSINESS' | 'PERSONAL' | 'SCIENCE' | 'SOCIAL' | 'ENVIRONMENTAL' | 'EDUCATION' | 'HEALTHCARE';
  name: string;
  description: string;
  icon: string;
  prompts: string[];
  examples: string[];
};

const dreamCategories: DreamCategory[] = [
  {
    id: 'CREATIVE',
    name: 'Creative Vision',
    description: 'Art, music, writing, and creative expression that pushes boundaries',
    icon: '🎨',
    prompts: [
      'What artistic vision keeps you awake at night?',
      'Describe the creative work that would define your legacy',
      'What would you create if resources were unlimited?'
    ],
    examples: ['Create a symphony that makes people cry', 'Write the novel that changes how people see the world']
  },
  {
    id: 'TECHNOLOGY',
    name: 'Tech Innovation',
    description: 'Revolutionary technology and digital solutions',
    icon: '🚀',
    prompts: [
      'What technology would solve humanity\'s biggest problem?',
      'Describe the app/platform that would change everything',
      'What impossible tech do you wish existed?'
    ],
    examples: ['Build AI that can cure any disease', 'Create virtual reality indistinguishable from reality']
  },
  {
    id: 'BUSINESS',
    name: 'Business Empire',
    description: 'Entrepreneurial ventures and market-changing businesses',
    icon: '💼',
    prompts: [
      'What business would you build to change the world?',
      'Describe your vision for disrupting an entire industry',
      'What company would make you proudest to have founded?'
    ],
    examples: ['Build the next trillion-dollar company', 'Create a business that employs a million people']
  },
  {
    id: 'PERSONAL',
    name: 'Personal Journey',
    description: 'Life goals, relationships, and personal transformation',
    icon: '🌟',
    prompts: [
      'What personal transformation seems impossible but would change everything?',
      'Describe the life you\'d live if fear wasn\'t a factor',
      'What personal achievement would make you feel complete?'
    ],
    examples: ['Learn to speak 10 languages fluently', 'Run a marathon on every continent']
  }
];

interface DreamFormData {
  title: string;
  description: string;
  category: DreamCategory['id'] | '';
  tags: string[];
  isPublic: boolean;
  currentTag: string;
}

interface DreamSubmissionFormProps {
  onSubmit: (data: DreamFormData) => Promise<void>;
  isLoading?: boolean;
}

export function DreamSubmissionForm({ onSubmit, isLoading = false }: DreamSubmissionFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<DreamFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    isPublic: false,
    currentTag: ''
  });
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DreamCategory | null>(null);

  // Real-time encouragement based on form progress
  useEffect(() => {
    const { title, description, category } = formData;
    const progress = [title, description, category].filter(Boolean).length;
    
    const messages = [
      "Every impossible dream starts with a single thought...",
      "You're beginning to shape something extraordinary...",
      "The universe is listening to your vision...",
      "Your dream is taking form - this is powerful stuff!"
    ];
    
    setEncouragementMessage(messages[progress] || messages[0]);
  }, [formData]);

  const updateFormData = (updates: Partial<DreamFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleCategorySelect = (category: DreamCategory) => {
    setSelectedCategory(category);
    updateFormData({ category: category.id });
    setStep(2);
  };

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      updateFormData({ 
        tags: [...formData.tags, formData.currentTag.trim()],
        currentTag: ''
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({ 
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome step
      case 1: return formData.category !== ''; // Category selection
      case 2: return formData.title.length >= 5; // Title step
      case 3: return formData.description.length >= 20; // Description step
      case 4: return true; // Final step
      default: return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed()) {
      await onSubmit(formData);
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8 py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          What's Your Impossible Dream?
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every breakthrough started as someone's "impossible" dream. Today, we track how AI makes the impossible... possible.
        </p>
      </div>
      
      <div className="bg-muted/30 border border-border rounded-lg p-8 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Here's how it works:</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Share your dream</p>
              <p className="text-muted-foreground">No matter how wild it seems</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">AI analyzes</p>
              <p className="text-muted-foreground">Multiple models assess feasibility</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Watch progress</p>
              <p className="text-muted-foreground">See impossibility scores drop over time</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => setStep(1)} 
        size="lg" 
        className="px-8 py-3 text-lg h-12"
      >
        Start Your Dream Journey
      </Button>
    </div>
  );

  const renderCategoryStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          What kind of impossible are we talking about?
        </h2>
        <p className="text-muted-foreground">
          Choose the category that best fits your dream
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {dreamCategories.map((category) => (
          <Card 
            key={category.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-md border border-border hover:border-primary/50"
            onClick={() => handleCategorySelect(category)}
          >
            <CardHeader className="text-center pb-3">
              <div className="text-3xl mb-3">{category.icon}</div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm text-muted-foreground">
                {category.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTitleStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          Give your dream a powerful name
        </h2>
        <p className="text-muted-foreground">
          What would you call this impossible thing you want to achieve?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base font-medium text-foreground">Dream Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g., Build an AI that can cure any disease"
            className="mt-2 text-lg h-12"
            maxLength={100}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={formData.title.length >= 5 ? 'text-primary' : ''}>
              {formData.title.length >= 5 ? '✓ Looks great!' : 'At least 5 characters'}
            </span>
            <span>{formData.title.length}/100</span>
          </div>
        </div>

        {selectedCategory && (
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">
              {selectedCategory.icon} {selectedCategory.name} Examples:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              {selectedCategory.examples.map((example, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => setStep(3)} 
          disabled={!canProceed()}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderDescriptionStep = () => {
    const currentPrompt = selectedCategory?.prompts[Math.floor(Math.random() * selectedCategory.prompts.length)] || 
                         "Describe your dream in vivid detail";

    return (
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            Paint the full picture
          </h2>
          <p className="text-muted-foreground">
            {currentPrompt}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="description" className="text-base font-medium text-foreground">Dream Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Be specific, be bold, be impossible... What would this dream look like when it's real? How would it change the world? What impact would it have?"
              className="mt-2 min-h-[120px] text-base"
              maxLength={2000}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span className={formData.description.length >= 20 ? 'text-primary' : ''}>
                {formData.description.length >= 20 ? '✓ Great detail!' : 'At least 20 characters'}
              </span>
              <span>{formData.description.length}/2000</span>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Pro Tip:
            </h4>
            <p className="text-sm text-muted-foreground">
              The more specific and detailed you are, the better our AI can assess your dream's path from impossible to possible. 
              Include why it matters, what obstacles exist, and what success would look like.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep(2)}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={() => setStep(4)} 
            disabled={!canProceed()}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderFinalStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          Almost there! Let's add the finishing touches
        </h2>
        <p className="text-muted-foreground">
          These details help us track and categorize your dream better
        </p>
      </div>

      <div className="space-y-6">
        {/* Tags */}
        <div>
          <Label className="text-base font-medium text-foreground">Tags (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Add keywords to help organize and discover similar dreams
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              value={formData.currentTag}
              onChange={(e) => updateFormData({ currentTag: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="e.g., AI, healthcare, breakthrough"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={addTag}
              variant="outline"
              disabled={!formData.currentTag.trim()}
            >
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Setting */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium text-foreground">Share your dream publicly</Label>
              <p className="text-sm text-muted-foreground">
                Let others see and get inspired by your impossible dream
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={(checked) => updateFormData({ isPublic: checked })}
            />
          </div>
        </div>

        {/* Dream Summary */}
        <Card className="bg-muted/30 border border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Your Dream Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium text-foreground">Title:</span> 
              <span className="text-muted-foreground ml-2">{formData.title}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground">Category:</span> 
              <span className="text-muted-foreground ml-2">{selectedCategory?.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground">Visibility:</span> 
              <span className="text-muted-foreground ml-2">{formData.isPublic ? 'Public' : 'Private'}</span>
            </div>
            {formData.tags.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-foreground">Tags:</span> 
                <span className="text-muted-foreground ml-2">{formData.tags.join(', ')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep(3)}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Creating Your Dream...' : 'Submit My Impossible Dream'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      {step > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              Step {step} of 4
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((step / 4) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Encouragement Message */}
      {step > 0 && encouragementMessage && (
        <div className="text-center mb-8">
          <p className="text-primary font-medium italic">
            {encouragementMessage}
          </p>
        </div>
      )}

      {/* Form Steps */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-8">
          {step === 0 && renderWelcomeStep()}
          {step === 1 && renderCategoryStep()}
          {step === 2 && renderTitleStep()}
          {step === 3 && renderDescriptionStep()}
          {step === 4 && renderFinalStep()}
        </CardContent>
      </Card>
    </div>
  );
}