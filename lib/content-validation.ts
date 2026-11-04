import { z } from 'zod';

const optionalText = z.string().trim().max(2000).optional().default('');
const tags = z.array(z.string().trim().min(1).max(40)).max(20).default([]);
const sortOrder = z.coerce.number().int().min(0).max(100000).default(0);
const webUrl = z.string().trim().max(2000).refine(value => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}, 'Use a valid HTTP or HTTPS URL.');

export const contentSchemas = {
  skills: z.object({
    name: z.string().trim().min(1).max(80),
    iconName: z.string().trim().min(1).max(40).default('Code'),
    category: z.string().trim().max(80).default('Development'),
    description: optionalText,
    level: z.coerce.number().int().min(0).max(100).default(50),
    sortOrder,
  }).strict(),
  'software-projects': z.object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(3000),
    imageUrl: webUrl.default(''),
    repoUrl: webUrl.default(''),
    liveUrl: webUrl.default(''),
    tags,
    sortOrder,
  }).strict(),
  'media-gallery': z.object({
    title: z.string().trim().min(1).max(120),
    description: optionalText,
    type: z.enum(['IMAGE', 'VIDEO']),
    mediaUrl: webUrl.refine(value => value.length > 0, 'Media URL is required.'),
    thumbnailUrl: webUrl.default(''),
    tool: z.string().trim().max(80).default(''),
    tags,
    sortOrder,
  }).strict(),
};

export type ContentResource = keyof typeof contentSchemas;

export const portfolioSettingsSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  roles: z.array(z.string().trim().min(1).max(80)).min(1).max(10),
  heroDescription: z.string().trim().max(1000),
  aboutIntro: z.string().trim().max(2000),
  aboutDescription: z.string().trim().max(3000),
  profilePhotoUrl: z.string().trim().max(2000).refine(value => {
    if (!value) return true;
    if (value.startsWith('/uploads/') && !value.includes('..')) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  }, 'Use a valid HTTP(S) image URL or upload an image.'),
}).strict();
