import { Zodios } from '@zodios/core';

import { AxiosRequestConfig } from '../../../utils/axios.js';
import { adminApis } from '../apis/adminApi.js';
import { Credentials } from '../types/credentials.js';
import AuthenticatedMethods from './authenticatedMethods.js';

type PagingQuery = {
  pageSize?: number;
  pageNumber?: number;
};

export default class AdminMethods extends AuthenticatedMethods<typeof adminApis> {
  constructor(baseUrl: string, creds: Credentials, axiosConfig: AxiosRequestConfig) {
    super(new Zodios(baseUrl, adminApis, { axiosConfig }), creds);
  }

  addGroupToGroupSet = async (
    siteId: string,
    groupSetId: string,
    groupId: string,
  ): Promise<unknown> =>
    await this._apiClient.addGroupToGroupSet({
      params: { siteId, groupSetId, groupId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.addGroupToGroupSet>[0]);

  addUserToGroup = async (siteId: string, groupId: string, body: unknown): Promise<unknown> =>
    await (this._apiClient as any).addUserToGroup(body, {
      siteId,
      groupId,
      ...this.authHeader,
    });

  addUserToSite = async (siteId: string, body: unknown): Promise<unknown> =>
    await (async () => {
      const url = `/sites/${siteId}/users`;
      console.warn('Constructing URL:', {
        method: 'POST',
        operation: 'add-user-to-site',
        siteId,
        url,
      });
      return await (this._apiClient as any).addUserToSite(body, {
        siteId,
        ...this.authHeader,
      });
    })();

  createGroup = async (
    siteId: string,
    body: unknown,
    queries?: { asJob?: boolean },
  ): Promise<unknown> =>
    await (this._apiClient as any).createGroup(body, {
      siteId,
      asJob: queries?.asJob,
      ...this.authHeader,
    });

  createGroupSet = async (siteId: string, body: unknown): Promise<unknown> =>
    await (this._apiClient as any).createGroupSet(body, {
      siteId,
      ...this.authHeader,
    });

  deleteGroup = async (siteId: string, groupId: string): Promise<unknown> =>
    await this._apiClient.deleteGroup({
      params: { siteId, groupId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.deleteGroup>[0]);

  deleteGroupSet = async (siteId: string, groupSetId: string): Promise<unknown> =>
    await this._apiClient.deleteGroupSet({
      params: { siteId, groupSetId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.deleteGroupSet>[0]);

  deleteUsersFromSiteWithCsv = async (siteId: string, body: unknown): Promise<unknown> =>
    await (this._apiClient as any).deleteUsersFromSiteWithCsv(body, {
      siteId,
      ...this.authHeader,
    });

  downloadUserCredentials = async (
    siteId: string,
    userId: string,
    body: unknown,
  ): Promise<unknown> =>
    await (this._apiClient as any).downloadUserCredentials(body, {
      siteId,
      userId,
      ...this.authHeader,
    });

  getGroupsForUser = async (
    siteId: string,
    userId: string,
    queries?: PagingQuery,
  ): Promise<unknown> =>
    await this._apiClient.getGroupsForUser({
      params: { siteId, userId },
      queries,
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.getGroupsForUser>[0]);

  getGroupSet = async (siteId: string, groupSetId: string): Promise<unknown> =>
    await this._apiClient.getGroupSet({
      params: { siteId, groupSetId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.getGroupSet>[0]);

  getUsersInGroup = async (
    siteId: string,
    groupId: string,
    queries?: PagingQuery,
  ): Promise<unknown> =>
    await this._apiClient.getUsersInGroup({
      params: { siteId, groupId },
      queries,
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.getUsersInGroup>[0]);

  getUsersOnSite = async (
    siteId: string,
    queries?: PagingQuery & { filter?: string; sort?: string; fields?: string },
  ): Promise<unknown> =>
    await this._apiClient.getUsersOnSite({
      params: { siteId },
      queries,
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.getUsersOnSite>[0]);

  importUsersToSiteFromCsv = async (
    siteId: string,
    body: unknown,
    queries?: { isVerbose?: boolean },
  ): Promise<unknown> =>
    await (this._apiClient as any).importUsersToSiteFromCsv(body, {
      siteId,
      isVerbose: queries?.isVerbose,
      ...this.authHeader,
    });

  listGroupSets = async (
    siteId: string,
    queries?: PagingQuery & { filter?: string; sort?: string },
  ): Promise<unknown> =>
    await this._apiClient.listGroupSets({
      params: { siteId },
      queries,
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.listGroupSets>[0]);

  queryGroups = async (
    siteId: string,
    queries?: PagingQuery & { filter?: string; sort?: string },
  ): Promise<unknown> =>
    await this._apiClient.queryGroups({
      params: { siteId },
      queries,
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.queryGroups>[0]);

  queryUserOnSite = async (siteId: string, userId: string): Promise<unknown> =>
    await this._apiClient.queryUserOnSite({
      params: { siteId, userId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.queryUserOnSite>[0]);

  removeGroupFromGroupSet = async (
    siteId: string,
    groupSetId: string,
    groupId: string,
  ): Promise<unknown> =>
    await this._apiClient.removeGroupFromGroupSet({
      params: { siteId, groupSetId, groupId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.removeGroupFromGroupSet>[0]);

  removeUserFromSite = async (
    siteId: string,
    userId: string,
    queries?: { mapAssetsTo?: string },
  ): Promise<unknown> =>
    await this._apiClient.removeUserFromSite({
      params: { siteId, userId },
      queries,
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.removeUserFromSite>[0]);

  removeUserFromGroup = async (siteId: string, groupId: string, userId: string): Promise<unknown> =>
    await this._apiClient.removeUserFromGroup({
      params: { siteId, groupId, userId },
      ...this.authHeader,
    } as unknown as Parameters<typeof this._apiClient.removeUserFromGroup>[0]);

  bulkRemoveUsersFromGroup = async (
    siteId: string,
    groupId: string,
    body: unknown,
  ): Promise<unknown> =>
    await (this._apiClient as any).bulkRemoveUsersFromGroup(body, {
      siteId,
      groupId,
      ...this.authHeader,
    });

  updateGroup = async (
    siteId: string,
    groupId: string,
    body: unknown,
    queries?: { asJob?: boolean },
  ): Promise<unknown> =>
    await (this._apiClient as any).updateGroup(body, {
      siteId,
      groupId,
      asJob: queries?.asJob,
      ...this.authHeader,
    });

  updateGroupSet = async (siteId: string, groupSetId: string, body: unknown): Promise<unknown> =>
    await (this._apiClient as any).updateGroupSet(body, {
      siteId,
      groupSetId,
      ...this.authHeader,
    });

  updateUser = async (siteId: string, userId: string, body: unknown): Promise<unknown> =>
    await (this._apiClient as any).updateUser(body, {
      siteId,
      userId,
      ...this.authHeader,
    });

  uploadUserCredentials = async (siteId: string, userId: string, body: unknown): Promise<unknown> =>
    await (this._apiClient as any).uploadUserCredentials(body, {
      siteId,
      userId,
      ...this.authHeader,
    });
}
