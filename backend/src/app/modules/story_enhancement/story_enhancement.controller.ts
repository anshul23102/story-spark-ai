import { Request, Response } from 'express';
import catchAsync from '../../../shared/catch_async';
import ApiError from '../../../errors/api_error';
import httpStatus from 'http-status';
import { StoryEnhancementService } from './story_enhancement.service';

const enhancementService = new StoryEnhancementService();

const applyStyleTransfer = catchAsync(async (req: Request, res: Response) => {
  const { story, style } = req.body;

  if (!story || !style) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'story and style are required');
  }

  const enhanced = enhancementService.applyStyleTransfer({
    story,
    style,
  });

  res.json({
    success: true,
    original: story,
    enhanced,
    style,
  });
});

const adaptTone = catchAsync(async (req: Request, res: Response) => {
  const { story, tone } = req.body;

  if (!story || !tone) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'story and tone are required');
  }

  const enhanced = enhancementService.adaptTone({
    story,
    tone,
  });

  res.json({
    success: true,
    original: story,
    enhanced,
    tone,
  });
});

const enhanceStory = catchAsync(async (req: Request, res: Response) => {
  const { story, style, tone } = req.body;

  if (!story || !style || !tone) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'story, style, and tone are required'
    );
  }

  const result = enhancementService.enhanceStory(story, style, tone);

  res.json({
    success: true,
    ...result,
  });
});

export const StoryEnhancementController = {
  applyStyleTransfer,
  adaptTone,
  enhanceStory,
};
