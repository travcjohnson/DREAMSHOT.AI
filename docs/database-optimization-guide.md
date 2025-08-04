# DREAMSHOT.AI Database Optimization Guide

## Overview

This guide outlines the optimized database schema design for DREAMSHOT.AI, focusing on performance, scalability, and the core functionality of tracking "Impossibility Decay" scores over time.

## Core Schema Design

### 1. Dream Model
The central entity storing user dreams/prompts with optimized structure:

```sql
-- Core fields optimized for queries
id (CUID primary key)
userId (indexed for user filtering)
title (searchable)
description (full text)
originalPrompt (full text, core data)
category (enum, indexed for filtering)
tags (array, for flexible categorization)
isPublic (boolean, indexed for public feeds)
status (enum, indexed for filtering)
```

**Key Optimizations:**
- Composite index on `(userId, createdAt DESC)` for user dream lists
- Category index for filtering and analytics
- Public dreams index for community features
- Status index for active/archived filtering

### 2. AiTest Model
Tracks individual AI model tests with comprehensive metrics:

```sql
-- Test execution tracking
dreamId (foreign key, cascading delete)
provider (enum for AI provider)
model (string for specific model version)
impossibilityScore (DECIMAL 5,2 for precision)
confidence (DECIMAL 5,2 for AI confidence)
reasoning (text for explainability)
duration (integer in milliseconds)
tokensUsed (integer for cost tracking)
cost (DECIMAL 10,6 for precise cost calculation)
```

**Key Optimizations:**
- Composite index on `(dreamId, createdAt DESC)` for dream progress
- Provider/model index for comparative analysis
- Impossibility score index for trend analysis
- Global created_at index for time-series queries

### 3. ProgressLog Model
Time-series optimized for tracking improvement over time:

```sql
-- Aggregated progress metrics
dreamId (foreign key)
averageImpossibility (DECIMAL 5,2)
bestScore (DECIMAL 5,2)
testCount (integer)
activeModels (string array)
improvementTrend (DECIMAL 5,2 percentage)
snapshotData (JSON for full context)
```

**Key Optimizations:**
- Time-series indexes for dashboard queries
- Average impossibility index for ranking
- Snapshot data in JSON for flexible analytics

### 4. AiModel Model
Configuration and cost tracking for AI providers:

```sql
-- Model metadata and pricing
provider (enum)
name (string)
displayName (string)
maxTokens (integer)
costPer1kTokens (DECIMAL 10,6)
isActive (boolean, indexed)
capabilities (string array)
```

## PostgreSQL-Specific Optimizations

### 1. Indexing Strategy

```sql
-- High-performance indexes for common queries
CREATE INDEX CONCURRENTLY idx_dreams_user_recent 
ON dreams (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_ai_tests_dream_timeline 
ON ai_tests (dream_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_progress_time_series 
ON progress_logs (dream_id, created_at DESC);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_dreams_active 
ON dreams (created_at DESC) WHERE status = 'ACTIVE';

CREATE INDEX CONCURRENTLY idx_models_active 
ON ai_models (provider, name) WHERE is_active = true;
```

### 2. Array Operations
```sql
-- Optimized array queries for tags and capabilities
CREATE INDEX CONCURRENTLY idx_dreams_tags_gin 
ON dreams USING GIN (tags);

CREATE INDEX CONCURRENTLY idx_models_capabilities_gin 
ON ai_models USING GIN (capabilities);
```

### 3. JSON Indexing
```sql
-- GIN indexes for metadata queries
CREATE INDEX CONCURRENTLY idx_progress_snapshot_gin 
ON progress_logs USING GIN (snapshot_data);

CREATE INDEX CONCURRENTLY idx_test_parameters_gin 
ON ai_tests USING GIN (test_parameters);
```

## Migration Strategy

### Phase 1: Add New Models (Zero Downtime)
```bash
# Generate and run migration for new models
npx prisma migrate dev --name add_dreamshot_core_models

# Verify migration
npx prisma db seed # Add initial AI model data
```

### Phase 2: Data Migration (If Existing Data)
```sql
-- Example migration for existing data
INSERT INTO dreams (id, user_id, title, description, original_prompt, category)
SELECT 
  gen_random_uuid(),
  user_id,
  'Migrated Dream',
  COALESCE(prompt, 'No description'),
  prompt,
  'OTHER'
FROM generations 
WHERE type = 'ANALYSIS';
```

### Phase 3: Cleanup Legacy Data (Optional)
- Keep legacy models for backward compatibility
- Archive old generation records after migration
- Update application code to use new models

## Performance Optimization Queries

### 1. Fast User Dashboard Query
```sql
-- Get user's recent dreams with latest progress
SELECT 
  d.id,
  d.title,
  d.category,
  d.created_at,
  pl.average_impossibility,
  pl.improvement_trend,
  COUNT(at.id) as test_count
FROM dreams d
LEFT JOIN progress_logs pl ON pl.dream_id = d.id AND pl.id = (
  SELECT id FROM progress_logs WHERE dream_id = d.id ORDER BY created_at DESC LIMIT 1
)
LEFT JOIN ai_tests at ON at.dream_id = d.id
WHERE d.user_id = $1 AND d.status = 'ACTIVE'
GROUP BY d.id, pl.average_impossibility, pl.improvement_trend
ORDER BY d.created_at DESC
LIMIT 20;
```

### 2. Progress Visualization Query
```sql
-- Time-series data for impossibility decay chart
SELECT 
  DATE_TRUNC('day', created_at) as date,
  AVG(impossibility_score) as avg_score,
  MIN(impossibility_score) as best_score,
  COUNT(*) as test_count
FROM ai_tests 
WHERE dream_id = $1 
  AND created_at >= NOW() - INTERVAL '30 days'
  AND status = 'COMPLETED'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date;
```

### 3. Model Comparison Analytics
```sql
-- Compare AI model performance across dreams
SELECT 
  provider,
  model,
  AVG(impossibility_score) as avg_impossibility,
  AVG(confidence) as avg_confidence,
  AVG(duration) as avg_duration_ms,
  COUNT(*) as test_count
FROM ai_tests 
WHERE status = 'COMPLETED'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY provider, model
ORDER BY avg_impossibility ASC;
```

### 4. Category Performance Analysis
```sql
-- Dream category success patterns
SELECT 
  d.category,
  COUNT(DISTINCT d.id) as dream_count,
  AVG(at.impossibility_score) as avg_impossibility,
  COUNT(at.id) as total_tests
FROM dreams d
JOIN ai_tests at ON at.dream_id = d.id
WHERE at.status = 'COMPLETED'
  AND d.status = 'ACTIVE'
GROUP BY d.category
ORDER BY avg_impossibility ASC;
```

## Scaling Considerations

### For 10k+ Users
1. **Connection Pooling**: Use PgBouncer or Prisma connection pooling
2. **Read Replicas**: Route analytics queries to read replicas
3. **Partitioning**: Consider monthly partitioning for ai_tests table

### For 100k+ Tests
1. **Time-based Partitioning**:
```sql
-- Partition ai_tests by month
CREATE TABLE ai_tests_y2024m01 PARTITION OF ai_tests
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

2. **Archival Strategy**:
```sql
-- Archive old test data to separate table
CREATE TABLE ai_tests_archive AS 
SELECT * FROM ai_tests 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Monitoring Queries

#### 1. Slow Query Detection
```sql
-- Find expensive queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE total_time > 1000
ORDER BY total_time DESC;
```

#### 2. Index Usage Analysis
```sql
-- Check index utilization
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_tup_read > 0
ORDER BY idx_tup_read DESC;
```

#### 3. Cache Hit Ratio
```sql
-- Monitor buffer cache efficiency
SELECT 
  'buffer_cache' as metric,
  ROUND(
    100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read))
  , 2) as hit_ratio
FROM pg_stat_database;
```

## Caching Strategy

### Redis Implementation
```typescript
// Cache frequently accessed data
const cacheKeys = {
  userDreams: (userId: string) => `user:${userId}:dreams`,
  dreamProgress: (dreamId: string) => `dream:${dreamId}:progress`,
  modelStats: 'models:performance:stats'
};

// Cache TTL recommendations
const cacheTTL = {
  userDreams: 300, // 5 minutes
  dreamProgress: 600, // 10 minutes
  modelStats: 3600 // 1 hour
};
```

### Cache Invalidation Strategy
- Invalidate user dreams cache on new dream creation
- Invalidate progress cache on test completion
- Use cache-aside pattern for consistent data

## Cost Optimization

### 1. Token Usage Tracking
```sql
-- Monitor API costs by user/model
SELECT 
  u.email,
  at.provider,
  at.model,
  SUM(at.tokens_used) as total_tokens,
  SUM(at.cost) as total_cost
FROM ai_tests at
JOIN users u ON u.id = at.user_id
WHERE at.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.email, at.provider, at.model
ORDER BY total_cost DESC;
```

### 2. Budget Alerts
```sql
-- Users approaching budget limits
SELECT 
  user_id,
  SUM(cost) as monthly_spend
FROM ai_tests 
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY user_id
HAVING SUM(cost) > 50.00; -- Alert threshold
```

This optimized schema provides a solid foundation for DREAMSHOT.AI's core functionality while maintaining excellent performance characteristics for the projected scale.