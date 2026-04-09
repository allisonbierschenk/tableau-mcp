import { getAdminGroupsTool } from './admin/groups/adminGroups.js';
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
  getContentPermissionsTool,
  getContentProjectsTool,
  getContentWorkbooksTool,
  getContentViewsTool,
  getSiteJobsTool,
  getTableauOperationsTool,
];
