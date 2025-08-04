'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface EvaluationScores {
  comprehension: number;
  quality: number;
  innovation: number;
  feasibility: number;
  overall: number;
  impossibility: number;
}

interface EvaluationResult {
  provider: string;
  model: string;
  scores: EvaluationScores;
  confidence: number;
  reasoning: string;
  metadata: {
    duration: number;
    tokensUsed?: number;
  };
}

interface DecayAnalysis {
  currentScore: number;
  previousScore: number | null;
  decayRate: number;
  trendDirection: 'improving' | 'worsening' | 'stable';
  confidence: number;
}

interface DreamEvaluationProps {
  dreamId: string;
  dreamTitle: string;
  onEvaluationComplete?: (results: any) => void;
}

export function DreamEvaluation({ dreamId, dreamTitle, onEvaluationComplete }: DreamEvaluationProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[] | null>(null);
  const [consensusResult, setConsensusResult] = useState<{ scores: EvaluationScores; confidence: number; reasoning: string } | null>(null);
  const [decayAnalysis, setDecayAnalysis] = useState<DecayAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async (retest: boolean = false) => {
    setIsEvaluating(true);
    setError(null);

    try {
      const response = await fetch(`/api/dreams/${dreamId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providers: ['openai', 'anthropic'],
          enableMultiModel: true,
          generateConsensus: true,
          retest
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const data = await response.json();
      
      if (data.useExisting) {
        setError('Recent evaluation found. Use "Force Retest" to run a new evaluation.');
        return;
      }

      setEvaluationResults(data.evaluations);
      setConsensusResult(data.consensus);
      setDecayAnalysis(data.decay);
      
      if (onEvaluationComplete) {
        onEvaluationComplete(data);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-blue-600';
    return 'text-green-600';
  };

  const getScoreLabel = (impossibilityScore: number) => {
    if (impossibilityScore >= 80) return 'Very Difficult';
    if (impossibilityScore >= 60) return 'Difficult';
    if (impossibilityScore >= 40) return 'Challenging';
    if (impossibilityScore >= 20) return 'Achievable';
    return 'Highly Achievable';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'worsening':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Evaluation
          </h3>
          <p className="text-sm text-gray-600">
            Analyze your dream's feasibility and track progress over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleEvaluate(false)}
            disabled={isEvaluating}
            variant="outline"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Evaluating...
              </>
            ) : (
              'Evaluate Dream'
            )}
          </Button>
          <Button
            onClick={() => handleEvaluate(true)}
            disabled={isEvaluating}
            variant="default"
          >
            Force Retest
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Consensus Results */}
      {consensusResult && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Consensus Evaluation
              <Badge variant="secondary" className={getScoreColor(consensusResult.scores.impossibility)}>
                {getScoreLabel(consensusResult.scores.impossibility)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {consensusResult.scores.comprehension.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Comprehension</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {consensusResult.scores.quality.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {consensusResult.scores.innovation.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Innovation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {consensusResult.scores.feasibility.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Feasibility</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(consensusResult.scores.impossibility)}`}>
                  {consensusResult.scores.impossibility.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Impossibility</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Confidence:</span>
                <Badge variant="outline">{consensusResult.confidence.toFixed(1)}%</Badge>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium mb-2">AI Reasoning:</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {consensusResult.reasoning}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decay Analysis */}
      {decayAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Impossibility Decay Analysis
              {getTrendIcon(decayAnalysis.trendDirection)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(decayAnalysis.currentScore)}`}>
                  {decayAnalysis.currentScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Current Score</div>
              </div>
              {decayAnalysis.previousScore && (
                <div className="text-center">
                  <div className={`text-xl font-bold ${getScoreColor(decayAnalysis.previousScore)}`}>
                    {decayAnalysis.previousScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Previous Score</div>
                </div>
              )}
              <div className="text-center">
                <div className={`text-xl font-bold ${
                  decayAnalysis.decayRate > 0 ? 'text-green-600' : 
                  decayAnalysis.decayRate < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {decayAnalysis.decayRate > 0 ? '+' : ''}{decayAnalysis.decayRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Change Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {decayAnalysis.confidence.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Trend:</span> Your dream is currently{' '}
                <span className={`font-medium ${
                  decayAnalysis.trendDirection === 'improving' ? 'text-green-600' :
                  decayAnalysis.trendDirection === 'worsening' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {decayAnalysis.trendDirection}
                </span>
                {decayAnalysis.decayRate !== 0 && (
                  <> by {Math.abs(decayAnalysis.decayRate).toFixed(1)}% since the last evaluation</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Model Results */}
      {evaluationResults && evaluationResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Individual Model Evaluations</h4>
          {evaluationResults.map((result, index) => (
            <Card key={index} className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{result.provider} / {result.model}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{result.confidence.toFixed(1)}% confidence</Badge>
                    <Badge className={getScoreColor(result.scores.impossibility)}>
                      {result.scores.impossibility.toFixed(1)} impossibility
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {result.scores.comprehension.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">Comprehension</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {result.scores.quality.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {result.scores.innovation.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">Innovation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {result.scores.feasibility.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600">Feasibility</div>
                  </div>
                </div>
                
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                    View Detailed Reasoning
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                    {result.reasoning}
                  </div>
                </details>
                
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>Duration: {result.metadata.duration}ms</span>
                  {result.metadata.tokensUsed && (
                    <span>Tokens: {result.metadata.tokensUsed}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default DreamEvaluation;