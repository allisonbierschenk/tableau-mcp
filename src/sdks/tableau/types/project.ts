import { z } from 'zod';

export const projectSchema = z
  .object({
    name: z.string(),
    id: z.string(),
  })
  .passthrough();

export type Project = z.infer<typeof projectSchema>;
