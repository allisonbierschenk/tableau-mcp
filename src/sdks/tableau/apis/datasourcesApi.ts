import { makeApi, makeEndpoint, ZodiosEndpointDefinitions } from '@zodios/core';
import { z } from 'zod';

import {
  dataSourceConnectionSchema,
  dataSourceRevisionSchema,
  dataSourceSchema,
  updateDataSourceConnectionRequestSchema,
  updateDataSourceRequestSchema,
} from '../types/dataSource.js';
import { paginationSchema } from '../types/pagination.js';
import { tagsSchema } from '../types/tags.js';
import { paginationParameters } from './paginationParameters.js';

const listDatasourcesEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/datasources',
  alias: 'listDatasources',
  description:
    'Returns a list of published data sources on the specified site. Supports a filter string as a query parameter in the format field:operator:value.',
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
      description: 'Filter string in the format field:operator:value (e.g., name:eq:Project Views)',
    },
  ],
  response: z.object({
    pagination: paginationSchema,
    datasources: z.object({
      datasource: z.optional(z.array(dataSourceSchema)),
    }),
  }),
});

const queryDatasourceEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/datasources/:datasourceId',
  alias: 'queryDatasource',
  description: 'Returns information about the specified data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({
    datasource: dataSourceSchema,
  }),
});

const deleteDatasourceEndpoint = makeEndpoint({
  method: 'delete',
  path: '/sites/:siteId/datasources/:datasourceId',
  alias: 'deleteDatasource',
  description: 'Deletes a data source from a site.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({}),
});

const updateDatasourceEndpoint = makeEndpoint({
  method: 'put',
  path: '/sites/:siteId/datasources/:datasourceId',
  alias: 'updateDatasource',
  description: 'Updates ownership, project, certification, or encryption status of a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'updateRequest',
      type: 'Body',
      schema: updateDataSourceRequestSchema,
    },
  ],
  response: z.object({
    datasource: dataSourceSchema,
  }),
});

const downloadDatasourceEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/datasources/:datasourceId/content',
  alias: 'downloadDatasource',
  description: 'Downloads a data source in .tdsx format.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'includeExtract',
      type: 'Query',
      schema: z.boolean().optional(),
    },
  ],
  response: z.any(),
});

const queryDatasourceConnectionsEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/datasources/:datasourceId/connections',
  alias: 'queryDatasourceConnections',
  description: 'Lists all connections for a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({
    connections: z.object({
      connection: z.array(dataSourceConnectionSchema).optional(),
    }),
  }),
});

const updateDatasourceConnectionEndpoint = makeEndpoint({
  method: 'put',
  path: '/sites/:siteId/datasources/:datasourceId/connections/:connectionId',
  alias: 'updateDatasourceConnection',
  description: 'Updates connection details for a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'connectionId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'updateRequest',
      type: 'Body',
      schema: updateDataSourceConnectionRequestSchema,
    },
  ],
  response: z.object({
    connection: dataSourceConnectionSchema,
  }),
});

const getDatasourceRevisionsEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/datasources/:datasourceId/revisions',
  alias: 'getDatasourceRevisions',
  description: 'Gets the revision history for a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    ...paginationParameters,
  ],
  response: z.object({
    pagination: paginationSchema,
    revisions: z.object({
      revision: z.array(dataSourceRevisionSchema).optional(),
    }),
  }),
});

const downloadDatasourceRevisionEndpoint = makeEndpoint({
  method: 'get',
  path: '/sites/:siteId/datasources/:datasourceId/revisions/:revisionNumber/content',
  alias: 'downloadDatasourceRevision',
  description: 'Downloads a specific revision of a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'revisionNumber',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.any(),
});

const removeDatasourceRevisionEndpoint = makeEndpoint({
  method: 'delete',
  path: '/sites/:siteId/datasources/:datasourceId/revisions/:revisionNumber',
  alias: 'removeDatasourceRevision',
  description: 'Removes a specific revision of a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'revisionNumber',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({}),
});

const addTagsToDatasourceEndpoint = makeEndpoint({
  method: 'put',
  path: '/sites/:siteId/datasources/:datasourceId/tags',
  alias: 'addTagsToDatasource',
  description: 'Adds one or more tags to a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'tags',
      type: 'Body',
      schema: z.object({
        tags: z.object({
          tag: z.array(z.object({ label: z.string() })),
        }),
      }),
    },
  ],
  response: z.object({
    tags: tagsSchema,
  }),
});

const deleteTagFromDatasourceEndpoint = makeEndpoint({
  method: 'delete',
  path: '/sites/:siteId/datasources/:datasourceId/tags/:tagName',
  alias: 'deleteTagFromDatasource',
  description: 'Deletes a tag from a data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'tagName',
      type: 'Path',
      schema: z.string(),
    },
  ],
  response: z.object({}),
});

const publishDatasourceEndpoint = makeEndpoint({
  method: 'post',
  path: '/sites/:siteId/datasources',
  alias: 'publishDatasource',
  description: 'Publishes a new data source.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'overwrite',
      type: 'Query',
      schema: z.boolean().optional(),
    },
    {
      name: 'append',
      type: 'Query',
      schema: z.boolean().optional(),
    },
    {
      name: 'body',
      type: 'Body',
      schema: z.any(),
    },
  ],
  response: z.object({
    datasource: dataSourceSchema,
  }),
});

const downloadDatasourceKeychainEndpoint = makeEndpoint({
  method: 'post',
  path: '/sites/:siteId/datasources/:datasourceId/retrieveKeychain',
  alias: 'downloadDatasourceKeychain',
  description: 'Downloads encrypted credentials for migration.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'body',
      type: 'Body',
      schema: z.any(),
    },
  ],
  response: z.any(),
});

const uploadDatasourceKeychainEndpoint = makeEndpoint({
  method: 'post',
  path: '/sites/:siteId/datasources/:datasourceId/uploadKeychain',
  alias: 'uploadDatasourceKeychain',
  description: 'Uploads encrypted credentials for migration.',
  parameters: [
    {
      name: 'siteId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'datasourceId',
      type: 'Path',
      schema: z.string(),
    },
    {
      name: 'body',
      type: 'Body',
      schema: z.any(),
    },
  ],
  response: z.any(),
});

const datasourcesApi = makeApi([
  listDatasourcesEndpoint,
  queryDatasourceEndpoint,
  deleteDatasourceEndpoint,
  updateDatasourceEndpoint,
  downloadDatasourceEndpoint,
  publishDatasourceEndpoint,
  queryDatasourceConnectionsEndpoint,
  updateDatasourceConnectionEndpoint,
  getDatasourceRevisionsEndpoint,
  downloadDatasourceRevisionEndpoint,
  removeDatasourceRevisionEndpoint,
  addTagsToDatasourceEndpoint,
  deleteTagFromDatasourceEndpoint,
  downloadDatasourceKeychainEndpoint,
  uploadDatasourceKeychainEndpoint,
]);
export const datasourcesApis = [...datasourcesApi] as const satisfies ZodiosEndpointDefinitions;
