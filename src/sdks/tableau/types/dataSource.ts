import { z } from 'zod';

import { projectSchema } from './project.js';
import { tagsSchema } from './tags.js';

export const dataSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  project: projectSchema,
  tags: tagsSchema,
  isCertified: z.boolean().optional(),
  certificationNote: z.string().optional(),
  encryptExtracts: z.string().optional(),
  owner: z.object({
    id: z.string(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  webpageUrl: z.string().optional(),
  contentUrl: z.string().optional(),
  type: z.string().optional(),
  useRemoteQueryAgent: z.boolean().optional(),
});

export const dataSourceConnectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  serverAddress: z.string().optional(),
  serverPort: z.string().optional(),
  userName: z.string().optional(),
  embedPassword: z.boolean().optional(),
  datasource: z.object({
    id: z.string(),
  }).optional(),
});

export const dataSourceRevisionSchema = z.object({
  revisionNumber: z.string(),
  createdAt: z.string(),
  publishedAt: z.string().optional(),
  deleted: z.boolean().optional(),
  current: z.boolean().optional(),
  sizeInBytes: z.number().optional(),
  publisher: z.object({
    id: z.string(),
  }).optional(),
});

export const updateDataSourceRequestSchema = z.object({
  datasource: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isCertified: z.boolean().optional(),
    certificationNote: z.string().optional(),
    encryptExtracts: z.string().optional(),
    project: z.object({
      id: z.string(),
    }).optional(),
    owner: z.object({
      id: z.string(),
    }).optional(),
  }),
});

export const updateDataSourceConnectionRequestSchema = z.object({
  connection: z.object({
    serverAddress: z.string().optional(),
    serverPort: z.string().optional(),
    userName: z.string().optional(),
    password: z.string().optional(),
    embedPassword: z.boolean().optional(),
  }),
});

export type DataSource = z.infer<typeof dataSourceSchema>;
export type DataSourceConnection = z.infer<typeof dataSourceConnectionSchema>;
export type DataSourceRevision = z.infer<typeof dataSourceRevisionSchema>;
