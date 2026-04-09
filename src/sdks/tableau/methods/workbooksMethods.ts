import { Zodios } from '@zodios/core';

import { AxiosRequestConfig } from '../../../utils/axios.js';
import { workbooksApis } from '../apis/workbooksApi.js';
import { Credentials } from '../types/credentials.js';
import { Pagination } from '../types/pagination.js';
import { Workbook } from '../types/workbook.js';
import AuthenticatedMethods from './authenticatedMethods.js';

/**
 * Workbooks methods of the Tableau Server REST API
 *
 * @export
 * @class WorkbooksMethods
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm
 */
export default class WorkbooksMethods extends AuthenticatedMethods<typeof workbooksApis> {
  constructor(baseUrl: string, creds: Credentials, axiosConfig: AxiosRequestConfig) {
    super(new Zodios(baseUrl, workbooksApis, { axiosConfig }), creds);
  }

  private jsonWriteHeaders(): AxiosRequestConfig {
    return {
      ...this.authHeader,
      headers: {
        ...this.authHeader.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Returns information about the specified workbook, including information about views and tags.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param {string} workbookId The ID of the workbook to return information for.
   * @param {string} siteId - The Tableau site ID
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#query_workbook
   */
  getWorkbook = async ({
    workbookId,
    siteId,
  }: {
    workbookId: string;
    siteId: string;
  }): Promise<Workbook> => {
    return (
      await this._apiClient.getWorkbook({
        params: { siteId, workbookId },
        ...this.authHeader,
      })
    ).workbook;
  };

  /**
   * Returns the workbooks on a site.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param siteId - The Tableau site ID
   * @param filter - The filter string to filter workbooks by
   * @param pageSize - The number of items to return in one response. The minimum is 1. The maximum is 1000. The default is 100.
   * @param pageNumber - The offset for paging. The default is 1.
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#query_workbooks_for_site
   */
  queryWorkbooksForSite = async ({
    siteId,
    filter,
    sort,
    fields,
    pageSize,
    pageNumber,
  }: {
    siteId: string;
    filter?: string;
    sort?: string;
    fields?: string;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<{ pagination: Pagination; workbooks: Workbook[] }> => {
    const response = await this._apiClient.queryWorkbooksForSite({
      params: { siteId },
      queries: { filter, sort, fields, pageSize, pageNumber },
      ...this.authHeader,
    });
    return {
      pagination: response.pagination,
      workbooks: response.workbooks.workbook ?? [],
    };
  };

  /**
   * Returns the workbooks for the specified user.
   *
   * Required scopes: `tableau:content:read`
   *
   * Resolve the target user's LUID with admin-users before calling when starting from an email.
   *
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#query_workbooks_for_user
   */
  queryWorkbooksForUser = async ({
    siteId,
    userId,
    ownedBy,
    filter,
    sort,
    fields,
    pageSize,
    pageNumber,
  }: {
    siteId: string;
    userId: string;
    ownedBy?: 'true' | 'false';
    filter?: string;
    sort?: string;
    fields?: string;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<{ pagination: Pagination; workbooks: Workbook[] }> => {
    const response = await this._apiClient.queryWorkbooksForUser({
      params: { siteId, userId },
      queries: { ownedBy, filter, sort, fields, pageSize, pageNumber },
      ...this.authHeader,
    });
    return {
      pagination: response.pagination,
      workbooks: response.workbooks.workbook ?? [],
    };
  };

  /**
   * Updates the specified workbook.
   *
   * Required scopes: `tableau:content:update`
   */
  updateWorkbook = async ({
    siteId,
    workbookId,
    body,
  }: {
    siteId: string;
    workbookId: string;
    body: unknown;
  }): Promise<unknown> =>
    await this._apiClient.updateWorkbook({
      params: { siteId, workbookId },
      body,
      ...this.jsonWriteHeaders(),
    });

  /**
   * Deletes the specified workbook.
   *
   * Required scopes: `tableau:content:delete`
   */
  deleteWorkbook = async ({
    siteId,
    workbookId,
  }: {
    siteId: string;
    workbookId: string;
  }): Promise<unknown> =>
    await this._apiClient.deleteWorkbook({
      params: { siteId, workbookId },
      ...this.authHeader,
    });

  /**
   * Downloads workbook file (.twbx) bytes.
   *
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm
   */
  downloadWorkbookContent = async ({
    siteId,
    workbookId,
  }: {
    siteId: string;
    workbookId: string;
  }): Promise<ArrayBuffer> => {
    const response = await this._apiClient.axios.get<ArrayBuffer>(
      `/sites/${siteId}/workbooks/${workbookId}/content`,
      {
        ...this.authHeader,
        responseType: 'arraybuffer',
      },
    );
    return response.data;
  };

  /** Full workbook JSON including fields not modeled in {@link workbookSchema} (e.g. contentPermissions). */
  getWorkbookRaw = async ({
    siteId,
    workbookId,
  }: {
    siteId: string;
    workbookId: string;
  }): Promise<unknown> => {
    const response = await this._apiClient.axios.get(`/sites/${siteId}/workbooks/${workbookId}`, {
      ...this.authHeader,
      headers: {
        ...this.authHeader.headers,
        Accept: 'application/json',
      },
    });
    return response.data;
  };
}
