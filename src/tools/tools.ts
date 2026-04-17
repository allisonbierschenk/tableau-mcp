import { getAdminDatasourcesTool } from './admin/datasources/adminDatasources.js';
import { getAdminGroupsTool } from './admin/groups/adminGroups.js';
import { getAdminPulseTool } from './admin/pulse/adminPulse.js';
import { getAdminUsersTool } from './admin/users/adminUsers.js';
import { getContentProjectsTool } from './content/contentProjects.js';
import { getContentViewsTool } from './content/contentViews.js';
import { getContentWorkbooksTool } from './content/contentWorkbooks.js';
import { getSiteJobsTool } from './jobs/siteJobs.js';
import { getTableauOperationsTool } from './operations/tableauOperations.js';
import { getContentPermissionsTool } from './permissions/contentPermissions.js';

export const toolFactories = [
  getAdminUsersTool,
  getAdminGroupsTool,
  getAdminPulseTool,
  getAdminDatasourcesTool,
  getContentPermissionsTool,
  getContentProjectsTool,
  getContentWorkbooksTool,
  getContentViewsTool,
  getSiteJobsTool,
  getTableauOperationsTool,
];
