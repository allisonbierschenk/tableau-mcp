import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Ok } from 'ts-results-es';
import { z } from 'zod';

import { useRestApi } from '../../../restApiInstance.js';
import { Server } from '../../../server.js';
import { Tool } from '../../tool.js';

const operations = [
  // Metric Definitions
  'create-metric-definition',
  'get-metric-definition',
  'update-metric-definition',
  'delete-metric-definition',
  'list-metric-definitions',
  'batch-get-metric-definitions',
  'list-metrics-from-definition',
  // Metrics
  'create-metric',
  'get-metric',
  'update-metric',
  'delete-metric',
  'get-or-create-metric',
  'batch-get-metrics',
  'list-recommended-metrics',
  // Tags
  'create-metric-tag',
  'delete-metric-tag',
  // Subscriptions
  'create-subscription',
  'get-subscription',
  'delete-subscription',
  'list-subscriptions',
  'batch-get-subscriptions',
  'batch-create-subscriptions',
  'batch-get-follower-counts',
  // Insights
  'generate-insight-bundle',
  'generate-insight-brief',
  // User Preferences
  'get-user-preferences',
  'update-user-preferences',
  'list-followed-metrics-groups',
  // Site & Configuration
  'get-entitlements',
  'get-measurement-periods',
  'list-alerts',
] as const;

type AdminPulseOperation = (typeof operations)[number];

const jwtScopesByOperation: Record<AdminPulseOperation, Array<string>> = {
  'create-metric-definition': ['tableau:insight_definitions:create'],
  'get-metric-definition': ['tableau:insight_definitions_metrics:read'],
  'update-metric-definition': ['tableau:insight_definitions:update'],
  'delete-metric-definition': ['tableau:insight_definitions:delete'],
  'list-metric-definitions': ['tableau:insight_definitions_metrics:read'],
  'batch-get-metric-definitions': ['tableau:insight_definitions_metrics:read'],
  'list-metrics-from-definition': ['tableau:insight_definitions_metrics:read'],
  'create-metric': ['tableau:insight_metrics:create'],
  'get-metric': ['tableau:insight_metrics:read'],
  'update-metric': ['tableau:insight_metrics:update'],
  'delete-metric': ['tableau:insight_metrics:delete'],
  'get-or-create-metric': ['tableau:insight_metrics:create'],
  'batch-get-metrics': ['tableau:insight_metrics:read'],
  'list-recommended-metrics': ['tableau:insight_metrics:read'],
  'create-metric-tag': ['tableau:insight_metrics:read'],
  'delete-metric-tag': ['tableau:insight_metrics:read'],
  'create-subscription': ['tableau:metric_subscriptions:create'],
  'get-subscription': ['tableau:metric_subscriptions:read'],
  'delete-subscription': ['tableau:metric_subscriptions:delete'],
  'list-subscriptions': ['tableau:metric_subscriptions:read'],
  'batch-get-subscriptions': ['tableau:metric_subscriptions:read'],
  'batch-create-subscriptions': ['tableau:metric_subscriptions:create'],
  'batch-get-follower-counts': ['tableau:metric_subscriptions:read'],
  'generate-insight-bundle': ['tableau:insights:read'],
  'generate-insight-brief': ['tableau:insight_brief:create'],
  'get-user-preferences': ['tableau:user_preferences:read'],
  'update-user-preferences': ['tableau:user_preferences:update'],
  'list-followed-metrics-groups': ['tableau:insights:read'],
  'get-entitlements': ['tableau:entitlements:read'],
  'get-measurement-periods': ['tableau:content:read'],
  'list-alerts': ['tableau:insights_alerts:read'],
};

const paramsSchema = {
  operation: z.enum(operations),
  definitionId: z.string().optional(),
  metricId: z.string().optional(),
  subscriptionId: z.string().optional(),
  tagId: z.string().optional(),
  userId: z.string().optional(),
  definitionIds: z.array(z.string()).optional(),
  metricIds: z.array(z.string()).optional(),
  subscriptionIds: z.array(z.string()).optional(),
  view: z.enum(['DEFINITION_VIEW_BASIC', 'DEFINITION_VIEW_FULL', 'DEFINITION_VIEW_DEFAULT']).optional(),
  bundleType: z.enum(['ban', 'springboard', 'basic', 'detail', 'exploration', 'breakdown']).optional(),
  pageSize: z.number().gt(0).optional(),
  pageToken: z.string().optional(),
  body: z.any().optional(),
};

export const getAdminPulseTool = (server: Server): Tool<typeof paramsSchema> => {
  const tool = new Tool({
    server,
    name: 'admin-pulse',
    description:
      'Administrative Tableau Pulse tool. Use this to manage Pulse metric definitions, metrics, subscriptions, tags, insights, user preferences, and alerts.',
    paramsSchema,
    annotations: {
      title: 'Admin Pulse',
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
                return await invokeOperation(restApi, args);
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
    pulseMethods: any;
  },
  args: z.objectOutputType<typeof paramsSchema, z.ZodTypeAny>,
): Promise<unknown> {
  const { pulseMethods } = restApi;

  switch (args.operation) {
    // Metric Definitions
    case 'create-metric-definition':
      return (await pulseMethods.createPulseMetricDefinition(required(args.body, 'body'))).unwrap();
    case 'get-metric-definition':
      return (await pulseMethods.getPulseMetricDefinition(required(args.definitionId, 'definitionId'), args.view)).unwrap();
    case 'update-metric-definition':
      return (await pulseMethods.updatePulseMetricDefinition(required(args.definitionId, 'definitionId'), required(args.body, 'body'))).unwrap();
    case 'delete-metric-definition':
      return (await pulseMethods.deletePulseMetricDefinition(required(args.definitionId, 'definitionId'))).unwrap();
    case 'list-metric-definitions':
      return (await pulseMethods.listAllPulseMetricDefinitions(args.view, args.pageToken, args.pageSize)).unwrap();
    case 'batch-get-metric-definitions':
      return (await pulseMethods.listPulseMetricDefinitionsFromMetricDefinitionIds(required(args.definitionIds, 'definitionIds'), args.view)).unwrap();
    case 'list-metrics-from-definition':
      return (await pulseMethods.listPulseMetricsFromMetricDefinitionId(required(args.definitionId, 'definitionId'))).unwrap();

    // Metrics
    case 'create-metric':
      return (await pulseMethods.createPulseMetric(required(args.body, 'body'))).unwrap();
    case 'get-metric':
      return (await pulseMethods.getPulseMetric(required(args.metricId, 'metricId'))).unwrap();
    case 'update-metric':
      return (await pulseMethods.updatePulseMetric(required(args.metricId, 'metricId'), required(args.body, 'body'))).unwrap();
    case 'delete-metric':
      return (await pulseMethods.deletePulseMetric(required(args.metricId, 'metricId'))).unwrap();
    case 'get-or-create-metric':
      return (await pulseMethods.getOrCreatePulseMetric(required(args.body, 'body'))).unwrap();
    case 'batch-get-metrics':
      return (await pulseMethods.listPulseMetricsFromMetricIds(required(args.metricIds, 'metricIds'))).unwrap();
    case 'list-recommended-metrics':
      return (await pulseMethods.listRecommendedPulseMetrics(args.pageSize)).unwrap();

    // Tags
    case 'create-metric-tag':
      return (await pulseMethods.createPulseMetricTag(required(args.metricId, 'metricId'), required(args.body, 'body'))).unwrap();
    case 'delete-metric-tag':
      return (await pulseMethods.deletePulseMetricTag(required(args.metricId, 'metricId'), required(args.tagId, 'tagId'))).unwrap();

    // Subscriptions
    case 'create-subscription':
      return (await pulseMethods.createPulseSubscription(required(args.body, 'body'))).unwrap();
    case 'get-subscription':
      return (await pulseMethods.getPulseSubscription(required(args.subscriptionId, 'subscriptionId'))).unwrap();
    case 'delete-subscription':
      return (await pulseMethods.deletePulseSubscription(required(args.subscriptionId, 'subscriptionId'))).unwrap();
    case 'list-subscriptions':
      return (await pulseMethods.listPulseMetricSubscriptionsForCurrentUser(args.userId)).unwrap();
    case 'batch-get-subscriptions':
      return (await pulseMethods.batchGetPulseSubscriptions(required(args.subscriptionIds, 'subscriptionIds'))).unwrap();
    case 'batch-create-subscriptions':
      return (await pulseMethods.batchCreatePulseSubscriptions(required(args.body, 'body'))).unwrap();
    case 'batch-get-follower-counts':
      return (await pulseMethods.batchGetMetricFollowerCounts(required(args.metricIds, 'metricIds'))).unwrap();

    // Insights
    case 'generate-insight-bundle':
      return (await pulseMethods.generatePulseMetricValueInsightBundle(required(args.body, 'body'), required(args.bundleType, 'bundleType'))).unwrap();
    case 'generate-insight-brief':
      return (await pulseMethods.generatePulseInsightBrief(required(args.body, 'body'))).unwrap();

    // User Preferences
    case 'get-user-preferences':
      return (await pulseMethods.getPulseUserPreferences()).unwrap();
    case 'update-user-preferences':
      return (await pulseMethods.updatePulseUserPreferences(required(args.body, 'body'))).unwrap();
    case 'list-followed-metrics-groups':
      return (await pulseMethods.listFollowedMetricsGroups()).unwrap();

    // Site & Configuration
    case 'get-entitlements':
      return (await pulseMethods.getPulseEntitlements()).unwrap();
    case 'get-measurement-periods':
      return (await pulseMethods.getPulseMeasurementPeriods(required(args.definitionId, 'definitionId'))).unwrap();
    case 'list-alerts':
      return (await pulseMethods.listPulseAlerts(args.pageSize, args.pageToken)).unwrap();
  }
}

function required<T>(value: T | undefined, fieldName: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Missing required parameter: ${fieldName}`);
  }
  return value;
}
