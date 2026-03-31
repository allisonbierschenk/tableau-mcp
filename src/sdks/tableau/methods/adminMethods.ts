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
    await (this._apiClient as any).addGroupToGroupSet(
      {
        siteId,
        groupSetId,
        groupId,
      },
      this.authHeader,
    );

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
    await (this._apiClient as any).deleteGroup({ siteId, groupId }, this.authHeader);

  deleteGroupSet = async (siteId: string, groupSetId: string): Promise<unknown> =>
    await (this._apiClient as any).deleteGroupSet({ siteId, groupSetId }, this.authHeader);

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
    await (this._apiClient as any).getGroupsForUser(
      {
        siteId,
        userId,
        pageSize: queries?.pageSize,
        pageNumber: queries?.pageNumber,
      },
      this.authHeader,
    );

  getGroupSet = async (siteId: string, groupSetId: string): Promise<unknown> =>
    await (this._apiClient as any).getGroupSet({ siteId, groupSetId }, this.authHeader);

  getUsersInGroup = async (
    siteId: string,
    groupId: string,
    queries?: PagingQuery,
  ): Promise<unknown> =>
    await (this._apiClient as any).getUsersInGroup(
      {
        siteId,
        groupId,
        pageSize: queries?.pageSize,
        pageNumber: queries?.pageNumber,
      },
      this.authHeader,
    );

  getUsersOnSite = async (
    siteId: string,
    queries?: PagingQuery & { filter?: string; sort?: string; fields?: string },
  ): Promise<unknown> =>
    await (this._apiClient as any).getUsersOnSite(
      {
        siteId,
        pageSize: queries?.pageSize,
        pageNumber: queries?.pageNumber,
        filter: queries?.filter,
        sort: queries?.sort,
        fields: queries?.fields,
      },
      this.authHeader,
    );

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
    await (this._apiClient as any).listGroupSets(
      {
        siteId,
        pageSize: queries?.pageSize,
        pageNumber: queries?.pageNumber,
        filter: queries?.filter,
        sort: queries?.sort,
      },
      this.authHeader,
    );

  queryGroups = async (
    siteId: string,
    queries?: PagingQuery & { filter?: string; sort?: string },
  ): Promise<unknown> =>
    await (this._apiClient as any).queryGroups(
      {
        siteId,
        pageSize: queries?.pageSize,
        pageNumber: queries?.pageNumber,
        filter: queries?.filter,
        sort: queries?.sort,
      },
      this.authHeader,
    );

  queryUserOnSite = async (siteId: string, userId: string): Promise<unknown> =>
    await (this._apiClient as any).queryUserOnSite({ siteId, userId }, this.authHeader);

  removeGroupFromGroupSet = async (
    siteId: string,
    groupSetId: string,
    groupId: string,
  ): Promise<unknown> =>
    await (this._apiClient as any).removeGroupFromGroupSet(
      {
        siteId,
        groupSetId,
        groupId,
      },
      this.authHeader,
    );

  removeUserFromSite = async (
    siteId: string,
    userId: string,
    queries?: { mapAssetsTo?: string },
  ): Promise<unknown> =>
    await (this._apiClient as any).removeUserFromSite(
      {
        siteId,
        userId,
        mapAssetsTo: queries?.mapAssetsTo,
      },
      this.authHeader,
    );

  removeUserFromGroup = async (siteId: string, groupId: string, userId: string): Promise<unknown> =>
    await (this._apiClient as any).removeUserFromGroup(
      { siteId, groupId, userId },
      this.authHeader,
    );

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
