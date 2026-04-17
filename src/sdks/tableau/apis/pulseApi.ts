import { makeApi, makeEndpoint, ZodiosEndpointDefinitions } from '@zodios/core';
import { z } from 'zod';

import {
  batchCreatePulseSubscriptionsRequestSchema,
  createPulseMetricDefinitionRequestSchema,
  createPulseMetricRequestSchema,
  createPulseMetricTagRequestSchema,
  createPulseSubscriptionRequestSchema,
  getOrCreatePulseMetricRequestSchema,
  pulseAlertSchema,
  pulseBundleRequestSchema,
  pulseBundleResponseSchema,
  pulseEntitlementsSchema,
  pulseFollowedMetricsGroupSchema,
  pulseInsightBriefRequestSchema,
  pulseInsightBriefResponseSchema,
  pulseInsightBundleTypeEnum,
  pulseMeasurementPeriodSchema,
  pulseMetricDefinitionSchema,
  pulseMetricDefinitionViewEnum,
  pulseMetricFollowerCountSchema,
  pulseMetricSchema,
  pulseMetricSubscriptionSchema,
  pulseMetricTagSchema,
  pulseRecommendedMetricsSchema,
  pulseSubscriptionDetailSchema,
  pulseUserPreferencesSchema,
  updatePulseMetricDefinitionRequestSchema,
  updatePulseMetricRequestSchema,
  updatePulseUserPreferencesRequestSchema,
} from '../types/pulse.js';

const listAllPulseMetricDefinitionsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/definitions',
  alias: 'listAllPulseMetricDefinitions',
  description: 'Returns a list of all published Pulse Metric Definitions on the specified site.',
  parameters: [
    {
      name: 'view',
      type: 'Query',
      schema: z.optional(z.enum(pulseMetricDefinitionViewEnum)),
      description: `The range of metrics to return for a definition. The default is 'DEFINITION_VIEW_BASIC' if not specified.
        - 'DEFINITION_VIEW_BASIC' - Return only the specified metric definition.
        - 'DEFINITION_VIEW_FULL' - Return the metric definition and the specified number of metrics.
        - 'DEFINITION_VIEW_DEFAULT' - Return the metric definition and the default metric.`,
    },
    {
      name: 'page_size',
      type: 'Query',
      schema: z.optional(z.coerce.number().int().positive()),
      description: 'Specifies the number of results in a paged response.',
    },
    {
      name: 'page_token',
      type: 'Query',
      schema: z.optional(z.string()),
      description: 'Token for retrieving the next page of results. Omit for the first page.',
    },
  ],
  response: z.object({
    definitions: z.array(pulseMetricDefinitionSchema),
    next_page_token: z.string().optional(),
    offset: z.coerce.number(),
    total_available: z.coerce.number(),
  }),
});

const listPulseMetricDefinitionsFromMetricDefinitionIdsRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/definitions%3AbatchGet',
  alias: 'listPulseMetricDefinitionsFromMetricDefinitionIds',
  description:
    'Returns a list of published Pulse Metric Definitions from a list of metric definition IDs.',
  parameters: [
    {
      name: 'definition_ids',
      type: 'Body',
      schema: z.object({ definition_ids: z.array(z.string().nonempty()).min(1) }),
      description: 'A list of metric definition IDs to retrieve.',
    },
    {
      name: 'view',
      type: 'Query',
      schema: z.optional(z.enum(pulseMetricDefinitionViewEnum)),
      description: `The range of metrics to return for a definition. The default is 'DEFINITION_VIEW_BASIC' if not specified.
        - 'DEFINITION_VIEW_BASIC' - Return only the specified metric definition.
        - 'DEFINITION_VIEW_FULL' - Return the metric definition and the specified number of metrics.
        - 'DEFINITION_VIEW_DEFAULT' - Return the metric definition and the default metric.`,
    },
  ],
  response: z.object({
    definitions: z.array(pulseMetricDefinitionSchema),
  }),
});

const listPulseMetricsFromMetricDefinitionIdRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/definitions/:pulseMetricDefinitionID/metrics',
  alias: 'listPulseMetricsFromMetricDefinitionId',
  description: 'Returns a list of published Pulse Metrics for a specific Pulse Metric Definition.',
  parameters: [
    {
      name: 'pulseMetricDefinitionID',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: z.object({
    metrics: z.array(pulseMetricSchema),
    total_available: z.number(),
  }),
});

const listPulseMetricsFromMetricIdsRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/metrics%3AbatchGet',
  alias: 'listPulseMetricsFromMetricIds',
  description: 'Returns a list of Pulse Metrics for a list of metric IDs.',
  parameters: [
    {
      name: 'metric_ids',
      type: 'Body',
      schema: z.object({ metric_ids: z.array(z.string().nonempty()) }),
    },
  ],
  response: z.object({
    metrics: z.array(pulseMetricSchema),
  }),
});

const listPulseMetricSubscriptionsForCurrentUserRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/subscriptions',
  alias: 'listPulseMetricSubscriptionsForCurrentUser',
  description: 'Returns a list of Pulse Subscriptions for the current user.',
  parameters: [
    {
      name: 'user_id',
      type: 'Query',
      schema: z.string().nonempty(),
    },
  ],
  response: z.object({
    subscriptions: z.array(pulseMetricSubscriptionSchema),
  }),
});

const generatePulseMetricValueInsightBundleRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/insights/:bundle_type',
  alias: 'generatePulseMetricValueInsightBundle',
  description: 'Generates a bundle for the current aggregated value for the Pulse metric.',
  parameters: [
    {
      name: 'bundle_request',
      type: 'Body',
      schema: pulseBundleRequestSchema,
    },
    {
      name: 'bundle_type',
      type: 'Path',
      schema: z.enum(pulseInsightBundleTypeEnum),
    },
  ],
  response: pulseBundleResponseSchema,
});

const generatePulseInsightBriefRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/insights/brief',
  alias: 'generatePulseInsightBrief',
  description:
    'Generates an AI-powered insight brief for Pulse metrics based on natural language questions.',
  parameters: [
    {
      name: 'brief_request',
      type: 'Body',
      schema: pulseInsightBriefRequestSchema,
    },
  ],
  response: pulseInsightBriefResponseSchema,
});

// Metric Definition CRUD
const createPulseMetricDefinitionRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/definitions',
  alias: 'createPulseMetricDefinition',
  description: 'Creates a new Pulse metric definition.',
  parameters: [
    {
      name: 'definition_request',
      type: 'Body',
      schema: createPulseMetricDefinitionRequestSchema,
    },
  ],
  response: pulseMetricDefinitionSchema,
});

const getPulseMetricDefinitionRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/definitions/:definitionId',
  alias: 'getPulseMetricDefinition',
  description: 'Retrieves a specific Pulse metric definition.',
  parameters: [
    {
      name: 'definitionId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
    {
      name: 'view',
      type: 'Query',
      schema: z.optional(z.enum(pulseMetricDefinitionViewEnum)),
    },
  ],
  response: pulseMetricDefinitionSchema,
});

const updatePulseMetricDefinitionRestEndpoint = makeEndpoint({
  method: 'patch',
  path: '/pulse/definitions/:definitionId',
  alias: 'updatePulseMetricDefinition',
  description: 'Updates a Pulse metric definition.',
  parameters: [
    {
      name: 'definitionId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
    {
      name: 'update_request',
      type: 'Body',
      schema: updatePulseMetricDefinitionRequestSchema,
    },
  ],
  response: pulseMetricDefinitionSchema,
});

const deletePulseMetricDefinitionRestEndpoint = makeEndpoint({
  method: 'delete',
  path: '/pulse/definitions/:definitionId',
  alias: 'deletePulseMetricDefinition',
  description: 'Deletes a Pulse metric definition.',
  parameters: [
    {
      name: 'definitionId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: z.object({}),
});

// Metric CRUD
const createPulseMetricRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/metrics',
  alias: 'createPulseMetric',
  description: 'Creates a new Pulse metric.',
  parameters: [
    {
      name: 'metric_request',
      type: 'Body',
      schema: createPulseMetricRequestSchema,
    },
  ],
  response: pulseMetricSchema,
});

const getPulseMetricRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/metrics/:metricId',
  alias: 'getPulseMetric',
  description: 'Retrieves a specific Pulse metric.',
  parameters: [
    {
      name: 'metricId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: pulseMetricSchema,
});

const updatePulseMetricRestEndpoint = makeEndpoint({
  method: 'patch',
  path: '/pulse/metrics/:metricId',
  alias: 'updatePulseMetric',
  description: 'Updates a Pulse metric.',
  parameters: [
    {
      name: 'metricId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
    {
      name: 'update_request',
      type: 'Body',
      schema: updatePulseMetricRequestSchema,
    },
  ],
  response: pulseMetricSchema,
});

const deletePulseMetricRestEndpoint = makeEndpoint({
  method: 'delete',
  path: '/pulse/metrics/:metricId',
  alias: 'deletePulseMetric',
  description: 'Deletes a Pulse metric.',
  parameters: [
    {
      name: 'metricId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: z.object({}),
});

const getOrCreatePulseMetricRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/metrics%3AgetOrCreate',
  alias: 'getOrCreatePulseMetric',
  description: 'Gets or creates a Pulse metric.',
  parameters: [
    {
      name: 'metric_request',
      type: 'Body',
      schema: getOrCreatePulseMetricRequestSchema,
    },
  ],
  response: pulseMetricSchema,
});

const listRecommendedPulseMetricsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/metrics%3Arecommended',
  alias: 'listRecommendedPulseMetrics',
  description: 'Lists recommended Pulse metrics for the current user.',
  parameters: [
    {
      name: 'page_size',
      type: 'Query',
      schema: z.optional(z.coerce.number().int().positive()),
    },
  ],
  response: pulseRecommendedMetricsSchema,
});

// Metric Tags
const createPulseMetricTagRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/metrics/:metricId/tag',
  alias: 'createPulseMetricTag',
  description: 'Creates a tag for a Pulse metric.',
  parameters: [
    {
      name: 'metricId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
    {
      name: 'tag_request',
      type: 'Body',
      schema: createPulseMetricTagRequestSchema,
    },
  ],
  response: pulseMetricTagSchema,
});

const deletePulseMetricTagRestEndpoint = makeEndpoint({
  method: 'delete',
  path: '/pulse/metrics/:metricId/tag/:tagId',
  alias: 'deletePulseMetricTag',
  description: 'Deletes a tag from a Pulse metric.',
  parameters: [
    {
      name: 'metricId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
    {
      name: 'tagId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: z.object({}),
});

// Subscriptions
const createPulseSubscriptionRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/subscriptions',
  alias: 'createPulseSubscription',
  description: 'Creates a new Pulse subscription.',
  parameters: [
    {
      name: 'subscription_request',
      type: 'Body',
      schema: createPulseSubscriptionRequestSchema,
    },
  ],
  response: pulseSubscriptionDetailSchema,
});

const getPulseSubscriptionRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/subscriptions/:subscriptionId',
  alias: 'getPulseSubscription',
  description: 'Retrieves a specific Pulse subscription.',
  parameters: [
    {
      name: 'subscriptionId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: pulseSubscriptionDetailSchema,
});

const deletePulseSubscriptionRestEndpoint = makeEndpoint({
  method: 'delete',
  path: '/pulse/subscriptions/:subscriptionId',
  alias: 'deletePulseSubscription',
  description: 'Deletes a Pulse subscription.',
  parameters: [
    {
      name: 'subscriptionId',
      type: 'Path',
      schema: z.string().nonempty(),
    },
  ],
  response: z.object({}),
});

const batchGetPulseSubscriptionsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/subscriptions%3AbatchGet',
  alias: 'batchGetPulseSubscriptions',
  description: 'Retrieves multiple Pulse subscriptions.',
  parameters: [
    {
      name: 'subscription_ids',
      type: 'Query',
      schema: z.string(),
    },
  ],
  response: z.object({
    subscriptions: z.array(pulseSubscriptionDetailSchema),
  }),
});

const batchCreatePulseSubscriptionsRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/subscriptions%3AbatchCreate',
  alias: 'batchCreatePulseSubscriptions',
  description: 'Creates multiple Pulse subscriptions.',
  parameters: [
    {
      name: 'subscriptions_request',
      type: 'Body',
      schema: batchCreatePulseSubscriptionsRequestSchema,
    },
  ],
  response: z.object({
    subscriptions: z.array(pulseSubscriptionDetailSchema),
  }),
});

const batchGetMetricFollowerCountsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/subscriptions%3AbatchGetMetricFollowerCounts',
  alias: 'batchGetMetricFollowerCounts',
  description: 'Gets follower counts for multiple metrics.',
  parameters: [
    {
      name: 'metric_ids',
      type: 'Query',
      schema: z.string(),
    },
  ],
  response: z.object({
    follower_counts: z.array(pulseMetricFollowerCountSchema),
  }),
});

// User Preferences
const getPulseUserPreferencesRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/user/preferences',
  alias: 'getPulseUserPreferences',
  description: 'Retrieves Pulse user preferences.',
  parameters: [],
  response: pulseUserPreferencesSchema,
});

const updatePulseUserPreferencesRestEndpoint = makeEndpoint({
  method: 'patch',
  path: '/pulse/user/preferences',
  alias: 'updatePulseUserPreferences',
  description: 'Updates Pulse user preferences.',
  parameters: [
    {
      name: 'preferences_request',
      type: 'Body',
      schema: updatePulseUserPreferencesRequestSchema,
    },
  ],
  response: pulseUserPreferencesSchema,
});

const listFollowedMetricsGroupsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/metrics%3AfollowedMetricsGroups',
  alias: 'listFollowedMetricsGroups',
  description: 'Lists followed metrics groups for the current user.',
  parameters: [],
  response: z.object({
    groups: z.array(pulseFollowedMetricsGroupSchema),
  }),
});

// Site & Configuration
const getPulseEntitlementsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/entitlements',
  alias: 'getPulseEntitlements',
  description: 'Checks Pulse feature entitlements.',
  parameters: [],
  response: pulseEntitlementsSchema,
});

const getPulseMeasurementPeriodsRestEndpoint = makeEndpoint({
  method: 'post',
  path: '/pulse/measurementPeriods',
  alias: 'getPulseMeasurementPeriods',
  description: 'Retrieves measurement periods for a definition.',
  parameters: [
    {
      name: 'request',
      type: 'Body',
      schema: z.object({
        definition_id: z.string(),
      }),
    },
  ],
  response: z.object({
    periods: z.array(pulseMeasurementPeriodSchema),
  }),
});

const listPulseAlertsRestEndpoint = makeEndpoint({
  method: 'get',
  path: '/pulse/alerts',
  alias: 'listPulseAlerts',
  description: 'Lists Pulse alerts for the current user.',
  parameters: [
    {
      name: 'page_size',
      type: 'Query',
      schema: z.optional(z.coerce.number().int().positive()),
    },
    {
      name: 'page_token',
      type: 'Query',
      schema: z.optional(z.string()),
    },
  ],
  response: z.object({
    alerts: z.array(pulseAlertSchema),
    next_page_token: z.string().optional(),
  }),
});

const pulseApi = makeApi([
  // Insights
  generatePulseMetricValueInsightBundleRestEndpoint,
  generatePulseInsightBriefRestEndpoint,
  // Metric Definitions
  createPulseMetricDefinitionRestEndpoint,
  getPulseMetricDefinitionRestEndpoint,
  updatePulseMetricDefinitionRestEndpoint,
  deletePulseMetricDefinitionRestEndpoint,
  listAllPulseMetricDefinitionsRestEndpoint,
  listPulseMetricDefinitionsFromMetricDefinitionIdsRestEndpoint,
  listPulseMetricsFromMetricDefinitionIdRestEndpoint,
  // Metrics
  createPulseMetricRestEndpoint,
  getPulseMetricRestEndpoint,
  updatePulseMetricRestEndpoint,
  deletePulseMetricRestEndpoint,
  getOrCreatePulseMetricRestEndpoint,
  listPulseMetricsFromMetricIdsRestEndpoint,
  listRecommendedPulseMetricsRestEndpoint,
  // Tags
  createPulseMetricTagRestEndpoint,
  deletePulseMetricTagRestEndpoint,
  // Subscriptions
  createPulseSubscriptionRestEndpoint,
  getPulseSubscriptionRestEndpoint,
  deletePulseSubscriptionRestEndpoint,
  listPulseMetricSubscriptionsForCurrentUserRestEndpoint,
  batchGetPulseSubscriptionsRestEndpoint,
  batchCreatePulseSubscriptionsRestEndpoint,
  batchGetMetricFollowerCountsRestEndpoint,
  // User Preferences
  getPulseUserPreferencesRestEndpoint,
  updatePulseUserPreferencesRestEndpoint,
  listFollowedMetricsGroupsRestEndpoint,
  // Site & Configuration
  getPulseEntitlementsRestEndpoint,
  getPulseMeasurementPeriodsRestEndpoint,
  listPulseAlertsRestEndpoint,
]);
export const pulseApis = [...pulseApi] as const satisfies ZodiosEndpointDefinitions;
