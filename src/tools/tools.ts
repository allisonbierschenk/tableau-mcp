import { getAdminGroupsTool } from './admin/groups/adminGroups.js';
import { getAdminUsersTool } from './admin/users/adminUsers.js';
import { getSiteJobsTool } from './jobs/siteJobs.js';
import { getTableauOperationsTool } from './operations/tableauOperations.js';
import { getContentPermissionsTool } from './permissions/contentPermissions.js';

export const toolFactories = [
  getAdminUsersTool,
  getAdminGroupsTool,
  getContentPermissionsTool,
  getSiteJobsTool,
  getTableauOperationsTool,
];
