import { generateAIResponse, type AIProvider, type AIModel } from './index';
import { prisma } from '@/lib/database/prisma';
import { AiProvider, TestStatus } from '@prisma/client';

export interface EvaluationResult {
  comprehensionScore: number;
  qualityScore: number;
  innovationScore: number;
  feasibilityScore: number;
  overallScore: number;
  confidence: number;
  reasoning: string;
  impossibilityScore: number;
  metadata: {
    provider: string;
    model: string;
    tokensUsed?: number;
    duration: number;
    testParameters: any;
  };
}

export interface EvaluationRequest {
  dreamId: string;
  userId: string;
  dreamTitle: string;
  dreamDescription: string;
  originalPrompt?: string;
  category: string;
  providers?: AIProvider[];
  enableMultiModel?: boolean;
}

/**
 * BMAD-Enhanced Evaluation Prompts
 * Using 2025 best practices with XML structured outputs and chain-of-thought reasoning
 */
const EVALUATION_SYSTEM_PROMPT = `You are an expert AI evaluator specializing in assessing the feasibility and innovation potential of human dreams and aspirations. Your role is to provide structured, unbiased evaluation using a proven 4-factor framework.

## Evaluation Framework

You must evaluate each dream across exactly 4 dimensions on a 0-100 scale:

1. **COMPREHENSION (0-100)**: How well-defined and clearly articulated is the dream?
   - 90-100: Crystal clear vision with specific goals and outcomes
   - 70-89: Well-defined with minor ambiguities
   - 50-69: Generally clear but lacks some specificity
   - 30-49: Vague or poorly defined in key areas
   - 0-29: Extremely unclear or incoherent

2. **QUALITY (0-100)**: How valuable and meaningful is this dream to society/individual?
   - 90-100: Transformative impact potential, addresses critical needs
   - 70-89: Significant positive impact, creates real value
   - 50-69: Moderate value, useful but not groundbreaking
   - 30-49: Limited value or questionable benefit
   - 0-29: Little to no meaningful value

3. **INNOVATION (0-100)**: How novel and creative is this approach/idea?
   - 90-100: Truly groundbreaking, never attempted before
   - 70-89: Highly innovative with new approaches
   - 50-69: Moderately innovative, creative improvements
   - 30-49: Some innovation but mostly incremental
   - 0-29: Little to no innovation, purely derivative

4. **FEASIBILITY (0-100)**: How achievable is this dream given current constraints?
   - 90-100: Highly achievable with current technology/resources
   - 70-89: Achievable with reasonable effort and resources
   - 50-69: Challenging but possible with significant effort
   - 30-49: Very difficult, requires major breakthroughs
   - 0-29: Nearly impossible with current capabilities

## Impossibility Score Calculation
Calculate the "Impossibility Score" as: 100 - (average of all 4 factors)
This represents how "impossible" the dream currently appears.

## Output Format
You MUST respond with valid JSON in this exact structure:

{
  "comprehensionScore": number,
  "qualityScore": number,
  "innovationScore": number,
  "feasibilityScore": number,
  "overallScore": number,
  "impossibilityScore": number,
  "confidence": number,
  "reasoning": "string"
}

## Chain-of-Thought Process
For each evaluation, think through:
1. Parse and understand the dream description
2. Assess each of the 4 factors individually
3. Calculate overall score (average of 4 factors)
4. Calculate impossibility score (100 - overall)
5. Determine confidence level (0-100) based on clarity of information
6. Provide clear reasoning for your assessment

## Bias Reduction Guidelines
- Ignore personal preferences or domain biases
- Focus on objective criteria within each dimension
- Consider both current state and realistic future progress
- Account for different pathways to achievement
- Separate personal taste from objective value assessment`;

const EVALUATION_USER_PROMPT = `<dream_evaluation>
<dream_title>{title}</dream_title>
<dream_description>{description}</dream_description>
<dream_category>{category}</dream_category>
<original_prompt>{originalPrompt}</original_prompt>

Please evaluate this dream using the 4-factor framework. Think through each dimension carefully and provide your assessment in the required JSON format.

<evaluation_context>
Remember to:
- Be objective and unbiased
- Consider multiple pathways to achievement
- Account for technological and social progress
- Separate feasibility from personal preference
- Provide specific reasoning for your scores
</evaluation_context>
</dream_evaluation>`;

/**
 * Multi-model consensus evaluation with bias reduction
 */
export async function evaluateDream(request: EvaluationRequest): Promise<EvaluationResult[]> {
  const {
    dreamId,
    userId,
    dreamTitle,
    dreamDescription,
    originalPrompt = dreamDescription,
    category,
    providers = ['openai', 'anthropic'],
    enableMultiModel = true
  } = request;

  const results: EvaluationResult[] = [];
  
  // Define model configurations for consensus evaluation
  const modelConfigs = [
    { provider: 'openai' as AIProvider, model: 'gpt-4o' as AIModel, temperature: 0.3 },
    { provider: 'anthropic' as AIProvider, model: 'claude-3-5-sonnet-20241022' as AIModel, temperature: 0.3 },
  ];

  // Filter by requested providers
  const activeConfigs = enableMultiModel 
    ? modelConfigs.filter(config => providers.includes(config.provider))
    : [modelConfigs[0]]; // Default to first model if multi-model disabled

  for (const config of activeConfigs) {
    try {
      const startTime = Date.now();
      
      // Prepare the evaluation prompt
      const userPrompt = EVALUATION_USER_PROMPT
        .replace('{title}', dreamTitle)
        .replace('{description}', dreamDescription)
        .replace('{category}', category)
        .replace('{originalPrompt}', originalPrompt);

      // Generate evaluation
      const response = await generateAIResponse({
        provider: config.provider,
        model: config.model,
        messages: [
          { role: 'system', content: EVALUATION_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: config.temperature,
        maxTokens: 2000
      });

      const duration = Date.now() - startTime;
      let content: string;
      let tokensUsed: number | undefined;

      // Handle different response formats
      if (config.provider === 'openai') {
        const openaiResponse = response as any;
        content = openaiResponse.choices[0]?.message?.content || '';
        tokensUsed = openaiResponse.usage?.total_tokens;
      } else {
        const anthropicResponse = response as any;
        content = anthropicResponse.content[0]?.text || '';
        tokensUsed = anthropicResponse.usage?.input_tokens + anthropicResponse.usage?.output_tokens;
      }

      // Parse JSON response
      const evaluation = parseEvaluationResponse(content);
      if (!evaluation) {
        throw new Error('Failed to parse evaluation response');
      }

      // Calculate overall score and impossibility score
      const overallScore = (
        evaluation.comprehensionScore +
        evaluation.qualityScore +
        evaluation.innovationScore +
        evaluation.feasibilityScore
      ) / 4;

      const impossibilityScore = 100 - overallScore;

      const result: EvaluationResult = {
        ...evaluation,
        overallScore,
        impossibilityScore,
        metadata: {
          provider: config.provider,
          model: config.model,
          tokensUsed,
          duration,
          testParameters: {
            temperature: config.temperature,
            maxTokens: 2000,
            evaluationVersion: '1.0',
            promptHash: hashString(EVALUATION_SYSTEM_PROMPT + userPrompt)
          }
        }
      };

      // Store in database
      await storeEvaluationResult(dreamId, userId, result);
      
      results.push(result);

    } catch (error) {
      console.error(`Evaluation failed for ${config.provider}/${config.model}:`, error);
      
      // Store failed test in database
      await storeFailedEvaluation(dreamId, userId, config, error as Error);
    }
  }

  return results;
}

/**
 * Parse and validate evaluation response
 */
function parseEvaluationResponse(content: string): Omit<EvaluationResult, 'overallScore' | 'impossibilityScore' | 'metadata'> | null {
  try {
    // Extract JSON from response (in case there's additional text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields and ranges
    const requiredFields = [
      'comprehensionScore', 'qualityScore', 'innovationScore', 
      'feasibilityScore', 'confidence', 'reasoning'
    ];
    
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate score ranges (0-100)
    const scoreFields = [
      'comprehensionScore', 'qualityScore', 'innovationScore', 
      'feasibilityScore', 'confidence'
    ];
    
    for (const field of scoreFields) {
      const value = parsed[field];
      if (typeof value !== 'number' || value < 0 || value > 100) {
        throw new Error(`Invalid ${field}: must be number between 0-100`);
      }
    }

    return {
      comprehensionScore: parsed.comprehensionScore,
      qualityScore: parsed.qualityScore,
      innovationScore: parsed.innovationScore,
      feasibilityScore: parsed.feasibilityScore,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning
    };

  } catch (error) {
    console.error('Failed to parse evaluation response:', error);
    return null;
  }
}

/**
 * Store successful evaluation result
 */
async function storeEvaluationResult(
  dreamId: string, 
  userId: string, 
  result: EvaluationResult
): Promise<void> {
  await prisma.aiTest.create({
    data: {
      dreamId,
      userId,
      provider: result.metadata.provider.toUpperCase() as AiProvider,
      model: result.metadata.model,
      testPrompt: EVALUATION_SYSTEM_PROMPT,
      response: JSON.stringify(result),
      impossibilityScore: result.impossibilityScore,
      confidence: result.confidence,
      reasoning: result.reasoning,
      status: TestStatus.COMPLETED,
      tokensUsed: result.metadata.tokensUsed,
      duration: result.metadata.duration,
      testParameters: result.metadata.testParameters,
      metadata: {
        evaluationScores: {
          comprehension: result.comprehensionScore,
          quality: result.qualityScore,
          innovation: result.innovationScore,
          feasibility: result.feasibilityScore,
          overall: result.overallScore
        },
        evaluationVersion: '1.0'
      }
    }
  });
}

/**
 * Store failed evaluation
 */
async function storeFailedEvaluation(
  dreamId: string,
  userId: string,
  config: { provider: AIProvider; model: AIModel },
  error: Error
): Promise<void> {
  await prisma.aiTest.create({
    data: {
      dreamId,
      userId,
      provider: config.provider.toUpperCase() as AiProvider,
      model: config.model,
      testPrompt: EVALUATION_SYSTEM_PROMPT,
      impossibilityScore: 0,
      confidence: 0,
      status: TestStatus.FAILED,
      errorMessage: error.message,
      testParameters: {
        temperature: 0.3,
        maxTokens: 2000,
        evaluationVersion: '1.0'
      },
      metadata: {
        evaluationVersion: '1.0',
        failureReason: error.message
      }
    }
  });
}

/**
 * Simple hash function for prompt versioning
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Calculate impossibility decay over time
 */
export async function calculateImpossibilityDecay(dreamId: string): Promise<{
  currentScore: number;
  previousScore: number | null;
  decayRate: number;
  trendDirection: 'improving' | 'worsening' | 'stable';
  confidence: number;
}> {
  // Get the two most recent evaluations
  const recentTests = await prisma.aiTest.findMany({
    where: {
      dreamId,
      status: TestStatus.COMPLETED
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10 // Get more for statistical confidence
  });

  if (recentTests.length === 0) {
    throw new Error('No completed evaluations found for this dream');
  }

  const currentScore = recentTests[0].impossibilityScore.toNumber();
  const previousScore = recentTests.length > 1 ? recentTests[1].impossibilityScore.toNumber() : null;
  
  let decayRate = 0;
  let trendDirection: 'improving' | 'worsening' | 'stable' = 'stable';
  let confidence = 0;

  if (previousScore !== null) {
    decayRate = ((previousScore - currentScore) / previousScore) * 100;
    
    if (Math.abs(decayRate) < 5) {
      trendDirection = 'stable';
      confidence = recentTests.length >= 3 ? 70 : 50;
    } else if (decayRate > 0) {
      trendDirection = 'improving'; // Impossibility decreasing = improvement
      confidence = Math.min(90, 50 + (recentTests.length * 10));
    } else {
      trendDirection = 'worsening'; // Impossibility increasing = worsening
      confidence = Math.min(90, 50 + (recentTests.length * 10));
    }
  }

  return {
    currentScore,
    previousScore,
    decayRate,
    trendDirection,
    confidence
  };
}

/**
 * Generate consensus evaluation from multiple models
 */
export async function generateConsensusEvaluation(
  evaluations: EvaluationResult[]
): Promise<EvaluationResult> {
  if (evaluations.length === 0) {
    throw new Error('No evaluations provided for consensus');
  }

  if (evaluations.length === 1) {
    return evaluations[0];
  }

  // Calculate weighted averages (higher confidence = higher weight)
  const totalConfidence = evaluations.reduce((sum, evaluation) => sum + evaluation.confidence, 0);
  
  const weightedScores = evaluations.reduce((acc, evaluation) => {
    const weight = evaluation.confidence / totalConfidence;
    return {
      comprehension: acc.comprehension + (evaluation.comprehensionScore * weight),
      quality: acc.quality + (evaluation.qualityScore * weight),
      innovation: acc.innovation + (evaluation.innovationScore * weight),
      feasibility: acc.feasibility + (evaluation.feasibilityScore * weight),
      confidence: acc.confidence + (evaluation.confidence * weight)
    };
  }, { comprehension: 0, quality: 0, innovation: 0, feasibility: 0, confidence: 0 });

  const overallScore = (
    weightedScores.comprehension +
    weightedScores.quality +
    weightedScores.innovation +
    weightedScores.feasibility
  ) / 4;

  const impossibilityScore = 100 - overallScore;

  // Combine reasoning from all evaluations
  const combinedReasoning = evaluations
    .map((evaluation, index) => `Model ${index + 1} (${evaluation.metadata.model}): ${evaluation.reasoning}`)
    .join('\n\n');

  return {
    comprehensionScore: Math.round(weightedScores.comprehension * 100) / 100,
    qualityScore: Math.round(weightedScores.quality * 100) / 100,
    innovationScore: Math.round(weightedScores.innovation * 100) / 100,
    feasibilityScore: Math.round(weightedScores.feasibility * 100) / 100,
    overallScore: Math.round(overallScore * 100) / 100,
    impossibilityScore: Math.round(impossibilityScore * 100) / 100,
    confidence: Math.round(weightedScores.confidence * 100) / 100,
    reasoning: `Consensus evaluation from ${evaluations.length} models:\n\n${combinedReasoning}`,
    metadata: {
      provider: 'consensus',
      model: `consensus-${evaluations.length}-models`,
      duration: Math.max(...evaluations.map(e => e.metadata.duration)),
      tokensUsed: evaluations.reduce((sum, e) => sum + (e.metadata.tokensUsed || 0), 0),
      testParameters: {
        modelCount: evaluations.length,
        models: evaluations.map(e => `${e.metadata.provider}/${e.metadata.model}`),
        consensusMethod: 'confidence-weighted-average'
      }
    }
  };
}