'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EmailCaptureProps {
  prompt: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function EmailCapture({ prompt, onSuccess, onClose }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Trigger success callback after animation
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="
          bg-white border-brutal border-black shadow-brutal-lg
          p-8 md:p-12 max-w-2xl w-full
          animate-in
        ">
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-display text-4xl mb-4">You&apos;re In!</h2>
            <p className="text-xl mb-2">
              Prompt #{Math.floor(Math.random() * 50000) + 10000} is now being tracked.
            </p>
            <p className="text-gray-600 mb-8">
              Check your inbox for your first benchmark report.
            </p>
            <div className="font-mono text-sm p-4 bg-gray-100 border-2 border-black">
              {prompt.slice(0, 60)}...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="
        bg-white border-brutal border-black shadow-brutal-lg
        p-8 md:p-12 max-w-2xl w-full
        relative
      ">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                     border-2 border-black hover:bg-black hover:text-white transition-colors"
          aria-label="Close"
        >
          <span className="text-2xl leading-none">×</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl mb-4">
            Track Your Prompt Forever
          </h2>
          <p className="text-xl text-gray-700">
            Get notified every time a new AI model runs your prompt.
            <br />
            <span className="highlight">Watch it evolve over years.</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block font-mono text-sm uppercase mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`
                w-full px-6 py-4 text-lg
                bg-white border-brutal border-black
                font-mono placeholder:text-gray-400
                focus:shadow-brutal focus:outline-none
                transition-shadow
                ${error ? 'border-red-600' : ''}
              `}
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 font-mono">{error}</p>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-400">
            <h3 className="font-mono text-sm uppercase mb-2">Privacy Promise</h3>
            <ul className="text-sm space-y-1">
              <li>• One email when new models launch</li>
              <li>• Unsubscribe with one click</li>
              <li>• Delete your data anytime</li>
              <li>• Never shared or sold</li>
            </ul>
          </div>

          {/* Your Prompt Preview */}
          <div className="p-4 bg-black text-green-400 font-mono text-sm">
            <div className="opacity-70 mb-1">YOUR PROMPT:</div>
            <div className="break-all">{prompt}</div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full py-6 text-lg font-bold uppercase
              bg-black text-white border-brutal border-black
              shadow-brutal hover:shadow-brutal-lg
              hover:translate-x-[-2px] hover:translate-y-[-2px]
              active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-100
            "
          >
            {isSubmitting ? 'Setting Up Tracking...' : 'Start Tracking →'}
          </Button>
        </form>

        {/* Bottom text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Join {Math.floor(Math.random() * 5000) + 3000} others tracking their prompts
        </p>
      </div>
    </div>
  );
}