'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { willSmithTimeline } from '@/lib/data/will-smith-timeline';

export function WillSmithGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto"
    >
      {willSmithTimeline.map((item, index) => (
        <div
          key={item.id}
          className={`
            relative group cursor-pointer
            border-brutal border-black bg-white
            shadow-brutal hover:shadow-brutal-lg
            transition-all duration-200
            ${isVisible ? 'animate-in' : 'opacity-0'}
          `}
          style={{
            animationDelay: `${index * 150}ms`,
            transform: hoveredIndex === index ? 'translate(-4px, -4px)' : 'none'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Image Container */}
          <div className="relative aspect-square bg-gray-100">
            {isVisible ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-6xl mb-2">🍝</div>
                  <div className="font-mono text-sm">{item.date}</div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            )}
            
            {/* Overlay on hover */}
            <div className={`
              absolute inset-0 bg-black text-white p-6
              flex flex-col justify-between
              transition-opacity duration-200
              ${hoveredIndex === index ? 'opacity-95' : 'opacity-0 pointer-events-none'}
            `}>
              <div>
                <h3 className="font-display text-2xl mb-2">{item.date}</h3>
                <p className="font-mono text-sm mb-4">{item.model}</p>
                <p className="text-sm italic">&ldquo;{item.caption}&rdquo;</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>PHYSICS</span>
                  <span>{item.quality.physics}%</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>COHERENCE</span>
                  <span>{item.quality.coherence}%</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>WATCHABLE</span>
                  <span>{item.quality.watchability}%</span>
                </div>
                <div className="border-t border-white pt-2 mt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>OVERALL</span>
                    <span>{item.quality.overall}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Label */}
          <div className="p-4 border-t-4 border-black">
            <h4 className="font-display text-lg font-bold">{item.description}</h4>
            <p className="font-mono text-xs text-gray-600 mt-1">{item.model}</p>
          </div>
        </div>
      ))}
    </div>
  );
}