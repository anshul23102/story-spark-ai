import { styleTransferEngine } from '../services/styleTransferEngine';
import { toneAdaptationEngine } from '../services/toneAdaptationEngine';
import { enhancementOrchestrator } from '../services/storyEnhancementOrchestrator';

describe('Story Enhancement Services', () => {
  const sampleStory = 'The hero walked down the dark street. He was scared. Suddenly, a shadow moved. He ran away quickly.';

  describe('StyleTransferEngine', () => {
    test('should transfer to literary style', () => {
      const result = styleTransferEngine.transferStyle(sampleStory, 'literary');
      expect(result.transformed).toBeTruthy();
      expect(result.style).toBe('literary');
      expect(result.metadata.wordCountAfter).toBeGreaterThan(0);
    });

    test('should transfer to casual style', () => {
      const result = styleTransferEngine.transferStyle(sampleStory, 'casual');
      expect(result.transformed).toBeTruthy();
      expect(result.transformed.toLowerCase()).toContain('wanna');
    });

    test('should transfer to poetic style', () => {
      const result = styleTransferEngine.transferStyle(sampleStory, 'poetic');
      expect(result.transformed).toBeTruthy();
      expect(result.style).toBe('poetic');
    });

    test('should transfer to children style', () => {
      const result = styleTransferEngine.transferStyle(sampleStory, 'children');
      expect(result.transformed).toBeTruthy();
      expect(result.style).toBe('children');
    });

    test('should cache transformations', () => {
      const story = 'Once upon a time there was a tale';
      styleTransferEngine.transferStyle(story, 'literary');
      const cached = styleTransferEngine.transferStyle(story, 'literary');

      expect(cached).toBeTruthy();
      expect(cached.style).toBe('literary');
    });

    test('should convert to first person narrative', () => {
      const story = 'The protagonist entered the room. He looked around carefully.';
      const result = styleTransferEngine.transferStyle(story, 'noir');
      expect(result.transformed).toBeTruthy();
    });

    test('should convert to third person narrative', () => {
      const story = 'I walked into the mysterious forest. We heard strange sounds.';
      const result = styleTransferEngine.transferStyle(story, 'technical');
      expect(result.transformed).toBeTruthy();
    });

    test('should provide available styles', () => {
      const styles = styleTransferEngine.getAvailableStyles();
      expect(styles.length).toBeGreaterThan(0);
      expect(styles[0]).toHaveProperty('style');
      expect(styles[0]).toHaveProperty('characteristics');
    });

    test('should throw error for unknown style', () => {
      expect(() => {
        styleTransferEngine.transferStyle(sampleStory, 'unknown' as any);
      }).toThrow();
    });
  });

  describe('ToneAdaptationEngine', () => {
    test('should adapt to cheerful tone', () => {
      const result = toneAdaptationEngine.adaptTone(sampleStory, 'cheerful');
      expect(result.adapted).toBeTruthy();
      expect(result.tone).toBe('cheerful');
      expect(result.intensity).toBe(1.0);
    });

    test('should adapt to melancholic tone', () => {
      const result = toneAdaptationEngine.adaptTone(sampleStory, 'melancholic');
      expect(result.adapted).toBeTruthy();
      expect(result.tone).toBe('melancholic');
    });

    test('should adapt to suspenseful tone', () => {
      const result = toneAdaptationEngine.adaptTone(sampleStory, 'suspenseful');
      expect(result.adapted).toBeTruthy();
      expect(result.tone).toBe('suspenseful');
    });

    test('should respect tone intensity parameter', () => {
      const result1 = toneAdaptationEngine.adaptTone(sampleStory, 'cheerful', 0.5);
      const result2 = toneAdaptationEngine.adaptTone(sampleStory, 'cheerful', 1.0);

      expect(result1.intensity).toBe(0.5);
      expect(result2.intensity).toBe(1.0);
    });

    test('should cache adaptations with intensity', () => {
      const story = 'The rain fell gently on the grass';
      toneAdaptationEngine.adaptTone(story, 'calm', 1.0);
      const cached = toneAdaptationEngine.adaptTone(story, 'calm', 1.0);

      expect(cached).toBeTruthy();
      expect(cached.tone).toBe('calm');
    });

    test('should adjust vocabulary based on tone', () => {
      const cheerfulResult = toneAdaptationEngine.adaptTone(sampleStory, 'cheerful');
      const seriousResult = toneAdaptationEngine.adaptTone(sampleStory, 'serious');

      expect(cheerfulResult.adapted).not.toBe(seriousResult.adapted);
    });

    test('should provide available tones', () => {
      const tones = toneAdaptationEngine.getAvailableTones();
      expect(tones.length).toBeGreaterThan(0);
      expect(tones[0]).toHaveProperty('tone');
      expect(tones[0]).toHaveProperty('characteristics');
    });

    test('should throw error for unknown tone', () => {
      expect(() => {
        toneAdaptationEngine.adaptTone(sampleStory, 'unknown' as any);
      }).toThrow();
    });
  });

  describe('StoryEnhancementOrchestrator', () => {
    test('should enhance story with style transfer', () => {
      const config = { style: 'literary' as const };
      const result = enhancementOrchestrator.enhance(sampleStory, config);

      expect(result.enhanced).toBeTruthy();
      expect(result.enhancements.styleTransferred).toBe(true);
      expect(result.metadata.qualityScore).toBeGreaterThanOrEqual(0);
    });

    test('should enhance story with tone adaptation', () => {
      const config = { tone: 'cheerful' as const, toneIntensity: 0.8 };
      const result = enhancementOrchestrator.enhance(sampleStory, config);

      expect(result.enhanced).toBeTruthy();
      expect(result.enhancements.toneAdapted).toBe(true);
    });

    test('should enhance with both style and tone', () => {
      const config = { style: 'literary' as const, tone: 'dramatic' as const };
      const result = enhancementOrchestrator.enhance(sampleStory, config);

      expect(result.enhanced).toBeTruthy();
      expect(result.enhancements.styleTransferred).toBe(true);
      expect(result.enhancements.toneAdapted).toBe(true);
    });

    test('should use default enhancement settings', () => {
      const result = enhancementOrchestrator.enhanceWithDefaults(sampleStory);

      expect(result.enhanced).toBeTruthy();
      expect(result.config.style).toBe('literary');
      expect(result.config.tone).toBe('cheerful');
    });

    test('should batch enhance multiple stories', () => {
      const stories = [sampleStory, sampleStory, sampleStory];
      const config = { style: 'casual' as const };
      const results = enhancementOrchestrator.batchEnhance(stories, config);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.enhancements.styleTransferred)).toBe(true);
    });

    test('should calculate quality score', () => {
      const config = { style: 'literary' as const, tone: 'cheerful' as const };
      const result = enhancementOrchestrator.enhance(sampleStory, config);

      expect(result.metadata.qualityScore).toBeGreaterThanOrEqual(0);
      expect(result.metadata.qualityScore).toBeLessThanOrEqual(100);
    });

    test('should track enhancement history', () => {
      const config = { style: 'children' as const };
      enhancementOrchestrator.enhance(sampleStory, config);

      const history = enhancementOrchestrator.getEnhancementHistory();
      expect(history.length).toBeGreaterThan(0);
    });

    test('should provide enhancement statistics', () => {
      enhancementOrchestrator.enhance(sampleStory, { style: 'literary' as const });
      const stats = enhancementOrchestrator.getEnhancementStats();

      expect(stats.totalEnhancements).toBeGreaterThan(0);
      expect(stats.averageQualityScore).toBeDefined();
      expect(stats.averageProcessingTime).toBeDefined();
    });

    test('should reject story below minimum length', () => {
      const shortStory = 'Too short';
      expect(() => {
        enhancementOrchestrator.enhance(shortStory, { style: 'literary' });
      }).toThrow();
    });

    test('should provide available styles and tones', () => {
      const styles = enhancementOrchestrator.getAvailableStyles();
      const tones = enhancementOrchestrator.getAvailableTones();

      expect(styles.length).toBeGreaterThan(0);
      expect(tones.length).toBeGreaterThan(0);
    });

    test('should clear cache', () => {
      enhancementOrchestrator.enhance(sampleStory, { style: 'literary' as const });
      enhancementOrchestrator.clearCache();

      const stats = enhancementOrchestrator.getEnhancementStats();
      expect(stats).toBeDefined();
    });
  });
});
