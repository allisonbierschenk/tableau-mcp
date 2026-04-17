import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { useRestApi } from '../../../restApiInstance.js';
import { Server } from '../../../server.js';
import { Tool } from '../../tool.js';

const operations = [
  'list-datasources',
  'query-datasource',
  'delete-datasource',
  'update-datasource',
  'download-datasource',
  'publish-datasource',
  'query-connections',
  'update-connection',
  'get-revisions',
  'download-revision',
  'remove-revision',
  'add-tags',
  'delete-tag',
  'download-keychain',
  'upload-keychain',
] as const;

type AdminDatasourcesOperation = (typeof operations)[number];

const jwtScopesByOperation: Record<AdminDatasourcesOperation, Array<string>> = {
  'list-datasources': ['tableau:content:read'],
  'query-datasource': ['tableau:content:read'],
  'delete-datasource': ['tableau:datasources:delete'],
  'update-datasource': ['tableau:datasources:update'],
  'download-datasource': ['tableau:datasources:download'],
  'publish-datasource': ['tableau:datasources:create'],
  'query-connections': ['tableau:content:read'],
  'update-connection': ['tableau:datasources:update'],
  'get-revisions': ['tableau:content:read'],
  'download-revision': ['tableau:content:read'],
  'remove-revision': ['tableau:datasources:delete'],
  'add-tags': ['tableau:datasource_tags:update'],
  'delete-tag': ['tableau:datasource_tags:delete'],
  'download-keychain': ['tableau:embedded_credentials:download'],
  'upload-keychain': ['tableau:embedded_credentials:upload'],
};

const paramsSchema = {
  operation: z.enum(operations),
  siteId: z.string().optional(),
  datasourceId: z.string().optional(),
  connectionId: z.string().optional(),
  revisionNumber: z.string().optional(),
  tagName: z.string().optional(),
  tags: z.array(z.string()).optional(),
  filter: z.string().optional(),
  pageSize: z.number().gt(0).optional(),
  pageNumber: z.number().gt(0).optional(),
  includeExtract: z.boolean().optional(),
  overwrite: z.boolean().optional(),
  append: z.boolean().optional(),
  body: z.any().optional(),
};

export const getAdminDatasourcesTool = (server: Server): Tool<typeof paramsSchema> => {
  const tool = new Tool({
    server,
    name: 'admin-datasources',
    description:
      'Administrative Tableau datasources tool. Use this to manage published data sources, including listing, querying, updating, deleting, downloading, publishing, managing connections, revisions, tags, and encrypted credentials.',
    paramsSchema,
    annotations: {
      title: 'Admin Datasources',
      readOnlyHint: false,
      openWorldHint: false,
    },
    callback: async (args, extra): Promise<CallToolResult> => {
      return await tool.logAndExecute({
        extra,
        args,
        callback: async () => {
          return new Ok(
            await useRestApi({
              ...extra,
              jwtScopes: jwtScopesByOperation[args.operation],
              callback: async (restApi) => {
                // Always use site LUID from authenticated context.
                return await invokeOperation(restApi, restApi.siteId, args);
              },
            }),
          );
        },
        constrainSuccessResult: (result) => ({ type: 'success', result }),
      });
    },
  });

  return tool;
};

async function invokeOperation(
  restApi: {
    datasourcesMethods: any;
  },
  siteId: string,
  args: z.objectOutputType<typeof paramsSchema, z.ZodTypeAny>,
): Promise<unknown> {
  const { datasourcesMethods } = restApi;

  switch (args.operation) {
    case 'list-datasources':
      return await datasourcesMethods.listDatasources({
        siteId,
        filter: required(args.filter, 'filter'),
        pageSize: args.pageSize,
        pageNumber: args.pageNumber,
      });

    case 'query-datasource':
      return await datasourcesMethods.queryDatasource({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
      });

    case 'delete-datasource':
      return await datasourcesMethods.deleteDatasource({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
      });

    case 'update-datasource':
      return await datasourcesMethods.updateDatasource({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        updateRequest: required(args.body, 'body'),
      });

    case 'download-datasource':
      return await datasourcesMethods.downloadDatasource({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        includeExtract: args.includeExtract,
      });

    case 'publish-datasource':
      return await datasourcesMethods.publishDatasource({
        siteId,
        body: required(args.body, 'body'),
        overwrite: args.overwrite,
        append: args.append,
      });

    case 'query-connections':
      return await datasourcesMethods.queryDatasourceConnections({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
      });

    case 'update-connection':
      return await datasourcesMethods.updateDatasourceConnection({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        connectionId: required(args.connectionId, 'connectionId'),
        updateRequest: required(args.body, 'body'),
      });

    case 'get-revisions':
      return await datasourcesMethods.getDatasourceRevisions({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        pageSize: args.pageSize,
        pageNumber: args.pageNumber,
      });

    case 'download-revision':
      return await datasourcesMethods.downloadDatasourceRevision({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        revisionNumber: required(args.revisionNumber, 'revisionNumber'),
      });

    case 'remove-revision':
      return await datasourcesMethods.removeDatasourceRevision({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        revisionNumber: required(args.revisionNumber, 'revisionNumber'),
      });

    case 'add-tags':
      return await datasourcesMethods.addTagsToDatasource({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        tags: required(args.tags, 'tags'),
      });

    case 'delete-tag':
      return await datasourcesMethods.deleteTagFromDatasource({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        tagName: required(args.tagName, 'tagName'),
      });

    case 'download-keychain':
      return await datasourcesMethods.downloadDatasourceKeychain({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        body: required(args.body, 'body'),
      });

    case 'upload-keychain':
      return await datasourcesMethods.uploadDatasourceKeychain({
        siteId,
        datasourceId: required(args.datasourceId, 'datasourceId'),
        body: required(args.body, 'body'),
      });
  }
}

function required<T>(value: T | undefined, fieldName: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Missing required parameter: ${fieldName}`);
  }
  return value;
}
