import { styleTransferEngine, StoryStyle } from './styleTransferEngine';
import { toneAdaptationEngine, EmotionalTone } from './toneAdaptationEngine';

interface EnhancementConfig {
  style?: StoryStyle;
  tone?: EmotionalTone;
  toneIntensity?: number;
  applyBoth?: boolean;
}

interface EnhancedStory {
  original: string;
  enhanced: string;
  config: EnhancementConfig;
  enhancements: {
    styleTransferred: boolean;
    toneAdapted: boolean;
  };
  metadata: {
    totalProcessingTime: number;
    qualityScore: number;
  };
}

export class StoryEnhancementOrchestrator {
  private readonly MIN_STORY_LENGTH = 50;
  private readonly MAX_STORY_LENGTH = 100000;
  private enhancementHistory: EnhancedStory[] = [];

  enhance(story: string, config: EnhancementConfig): EnhancedStory {
    if (story.length < this.MIN_STORY_LENGTH) {
      throw new Error(`Story must be at least ${this.MIN_STORY_LENGTH} characters`);
    }

    if (story.length > this.MAX_STORY_LENGTH) {
      throw new Error(`Story must not exceed ${this.MAX_STORY_LENGTH} characters`);
    }

    const startTime = Date.now();
    let enhanced = story;
    const enhancements = { styleTransferred: false, toneAdapted: false };

    if (config.style) {
      try {
        const styleResult = styleTransferEngine.transferStyle(story, config.style);
        enhanced = styleResult.transformed;
        enhancements.styleTransferred = true;
      } catch (error) {
        console.error('Style transfer failed:', error);
      }
    }

    if (config.tone) {
      try {
        const toneIntensity = config.toneIntensity || 1.0;
        const toneResult = toneAdaptationEngine.adaptTone(enhanced, config.tone, toneIntensity);
        enhanced = toneResult.adapted;
        enhancements.toneAdapted = true;
      } catch (error) {
        console.error('Tone adaptation failed:', error);
      }
    }

    const qualityScore = this.calculateQualityScore(story, enhanced, enhancements);
    const processingTime = Date.now() - startTime;

    const result: EnhancedStory = {
      original: story,
      enhanced,
      config,
      enhancements,
      metadata: {
        totalProcessingTime: processingTime,
        qualityScore,
      },
    };

    this.enhancementHistory.push(result);
    return result;
  }

  enhanceWithDefaults(story: string): EnhancedStory {
    return this.enhance(story, {
      style: 'literary',
      tone: 'cheerful',
      toneIntensity: 1.0,
    });
  }

  batchEnhance(stories: string[], config: EnhancementConfig): EnhancedStory[] {
    return stories.map((story) => this.enhance(story, config));
  }

  private calculateQualityScore(original: string, enhanced: string, enhancements: any): number {
    let score = 50;

    if (enhancements.styleTransferred) score += 20;
    if (enhancements.toneAdapted) score += 20;

    const originalLength = original.length;
    const enhancedLength = enhanced.length;
    const lengthChange = Math.abs(enhancedLength - originalLength) / originalLength;

    if (lengthChange < 0.2) score += 10;
    else if (lengthChange < 0.5) score += 5;

    const wordDiversity = this.calculateWordDiversity(enhanced);
    if (wordDiversity > 0.6) score += 10;
    else if (wordDiversity > 0.4) score += 5;

    return Math.min(100, score);
  }

  private calculateWordDiversity(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
  }

  getEnhancementHistory(): EnhancedStory[] {
    return [...this.enhancementHistory];
  }

  getEnhancementStats() {
    if (this.enhancementHistory.length === 0) {
      return {
        totalEnhancements: 0,
        averageQualityScore: 0,
        averageProcessingTime: 0,
        styleTransferUsage: 0,
        toneAdaptationUsage: 0,
      };
    }

    const stats = this.enhancementHistory;
    const avgQuality = stats.reduce((sum, s) => sum + s.metadata.qualityScore, 0) / stats.length;
    const avgTime = stats.reduce((sum, s) => sum + s.metadata.totalProcessingTime, 0) / stats.length;
    const styleUsage = stats.filter((s) => s.enhancements.styleTransferred).length;
    const toneUsage = stats.filter((s) => s.enhancements.toneAdapted).length;

    return {
      totalEnhancements: stats.length,
      averageQualityScore: Math.round(avgQuality),
      averageProcessingTime: Math.round(avgTime),
      styleTransferUsage: styleUsage,
      toneAdaptationUsage: toneUsage,
    };
  }

  getAvailableStyles() {
    return styleTransferEngine.getAvailableStyles();
  }

  getAvailableTones() {
    return toneAdaptationEngine.getAvailableTones();
  }

  clearCache(): void {
    styleTransferEngine.clearCache();
    toneAdaptationEngine.clearCache();
  }
}

export const enhancementOrchestrator = new StoryEnhancementOrchestrator();
