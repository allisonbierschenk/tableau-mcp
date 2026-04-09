import { makeApi, makeEndpoint, ZodiosEndpointDefinitions } from '@zodios/core';
import { z } from 'zod';

import { paginationSchema } from '../types/pagination.js';
import { workbookSchema } from '../types/workbook.js';
import { paginationParameters } from './paginationParameters.js';

const getWorkbookEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/workbooks/:workbookId',
  alias: 'getWorkbook',
  description:
    'Returns information about the specified workbook, including information about views and tags.',
  response: z.object({ workbook: workbookSchema }),
});

const queryWorkbooksForSiteEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/workbooks',
  alias: 'queryWorkbooksForSite',
  description: 'Returns the workbooks on a site.',
  parameters: [
    ...paginationParameters,
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'filter',
      type: 'Query',
      schema: z.string().optional(),
      description:
        'An expression that lets you specify a subset of workbooks to return. You can filter on predefined fields such as name, tags, and createdAt. You can include multiple filter expressions.',
    },
    {
      name: 'sort',
      type: 'Query',
      schema: z.string().optional(),
      description: 'Sort expression for the result set.',
    },
    {
      name: 'fields',
      type: 'Query',
      schema: z.string().optional(),
      description: 'Comma-separated list of fields to include in the response.',
    },
  ],
  response: z.object({
    pagination: paginationSchema,
    workbooks: z.object({
      workbook: z.optional(z.array(workbookSchema)),
    }),
  }),
});

const queryWorkbooksForUserEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/users/:userId/workbooks',
  alias: 'queryWorkbooksForUser',
  description: 'Returns the workbooks for the specified user.',
  parameters: [
    ...paginationParameters,
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'userId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'ownedBy',
      type: 'Query',
      schema: z.enum(['true', 'false']).optional(),
      description:
        'true returns only workbooks the user owns; false returns all workbooks the user can read. Default is false per Tableau REST API.',
    },
    {
      name: 'filter',
      type: 'Query',
      schema: z.string().optional(),
    },
    {
      name: 'sort',
      type: 'Query',
      schema: z.string().optional(),
    },
    {
      name: 'fields',
      type: 'Query',
      schema: z.string().optional(),
    },
  ],
  response: z.object({
    pagination: paginationSchema,
    workbooks: z.object({
      workbook: z.optional(z.array(workbookSchema)),
    }),
  }),
});

const updateWorkbookEndpoint = makeEndpoint({
  method: 'put',
  path: '/sites/:siteId/workbooks/:workbookId',
  alias: 'updateWorkbook',
  description: 'Updates the specified workbook.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'workbookId',
      type: 'Path',
      schema: z.string(),
    },
    { name: 'body', type: 'Body', schema: z.any() },
  ],
  response: z.any(),
});

const deleteWorkbookEndpoint = makeEndpoint({
  method: 'delete',
  path: '/sites/:siteId/workbooks/:workbookId',
  alias: 'deleteWorkbook',
  description: 'Deletes the specified workbook.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'workbookId',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.any(),
});

const workbooksApi = makeApi([
  queryWorkbooksForSiteEndpoint,
  queryWorkbooksForUserEndpoint,
  getWorkbookEndpoint,
  updateWorkbookEndpoint,
  deleteWorkbookEndpoint,
]);

export const workbooksApis = [...workbooksApi] as const satisfies ZodiosEndpointDefinitions;
