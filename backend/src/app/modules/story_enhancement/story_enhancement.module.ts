import { Router } from 'express';
import { StoryEnhancementController } from './story_enhancement.controller';

const router = Router();

router.post('/style', StoryEnhancementController.applyStyleTransfer);
router.post('/tone', StoryEnhancementController.adaptTone);
router.post('/full', StoryEnhancementController.enhanceStory);

export default router;
