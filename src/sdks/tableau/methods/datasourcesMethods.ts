import { Zodios } from '@zodios/core';
import z from 'zod';

import { AxiosRequestConfig } from '../../../utils/axios.js';
import { datasourcesApis } from '../apis/datasourcesApi.js';
import { Credentials } from '../types/credentials.js';
import {
  DataSource,
  DataSourceConnection,
  DataSourceRevision,
  updateDataSourceConnectionRequestSchema,
  updateDataSourceRequestSchema,
} from '../types/dataSource.js';
import { Pagination } from '../types/pagination.js';
import { Tags } from '../types/tags.js';
import AuthenticatedMethods from './authenticatedMethods.js';

/**
 * Data Sources methods of the Tableau Server REST API
 *
 * @export
 * @class DatasourcesMethods
 * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm
 */
export default class DatasourcesMethods extends AuthenticatedMethods<typeof datasourcesApis> {
  constructor(baseUrl: string, creds: Credentials, axiosConfig: AxiosRequestConfig) {
    super(new Zodios(baseUrl, datasourcesApis, { axiosConfig }), creds);
  }

  /**
   * Returns a list of published data sources on the specified site.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param siteId - The Tableau site ID
   * @param filter - The filter string to filter datasources by
   * @param pageSize - The number of items to return in one response. The minimum is 1. The maximum is 1000. The default is 100.
   * @param pageNumber - The offset for paging. The default is 1.
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#query_data_sources
   */
  listDatasources = async ({
    siteId,
    filter,
    pageSize,
    pageNumber,
  }: {
    siteId: string;
    filter?: string;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<{ pagination: Pagination; datasources: DataSource[] }> => {
    const response = await this._apiClient.listDatasources({
      params: { siteId },
      queries: { filter, pageSize, pageNumber },
      ...this.authHeader,
    });
    return {
      pagination: response.pagination,
      datasources: response.datasources.datasource ?? [],
    };
  };

  /**
   * Returns information about the specified data source.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#query_data_source
   */
  queryDatasource = async ({
    siteId,
    datasourceId,
  }: {
    siteId: string;
    datasourceId: string;
  }): Promise<DataSource> => {
    return (
      await this._apiClient.queryDatasource({
        params: { siteId, datasourceId },
        ...this.authHeader,
      })
    ).datasource;
  };

  /**
   * Deletes a data source from a site.
   *
   * Required scopes: `tableau:datasources:delete`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source to delete
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#delete_data_source
   */
  deleteDatasource = async ({
    siteId,
    datasourceId,
  }: {
    siteId: string;
    datasourceId: string;
  }): Promise<void> => {
    await this._apiClient.deleteDatasource({
      params: { siteId, datasourceId },
      ...this.authHeader,
    });
  };

  /**
   * Updates a data source.
   *
   * Required scopes: `tableau:datasources:update`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param updateRequest - The update request body
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#update_data_source
   */
  updateDatasource = async ({
    siteId,
    datasourceId,
    updateRequest,
  }: {
    siteId: string;
    datasourceId: string;
    updateRequest: z.infer<typeof updateDataSourceRequestSchema>;
  }): Promise<DataSource> => {
    return (
      await this._apiClient.updateDatasource(updateRequest, {
        params: { siteId, datasourceId },
        ...this.authHeader,
      })
    ).datasource;
  };

  /**
   * Downloads a data source.
   *
   * Required scopes: `tableau:datasources:download`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param includeExtract - Whether to include the extract
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#download_data_source
   */
  downloadDatasource = async ({
    siteId,
    datasourceId,
    includeExtract,
  }: {
    siteId: string;
    datasourceId: string;
    includeExtract?: boolean;
  }): Promise<any> => {
    return await this._apiClient.downloadDatasource({
      params: { siteId, datasourceId },
      queries: { includeExtract },
      ...this.authHeader,
    });
  };

  /**
   * Publishes a data source.
   *
   * Required scopes: `tableau:datasources:create`
   *
   * @param siteId - The Tableau site ID
   * @param body - The multipart form data
   * @param overwrite - Whether to overwrite existing datasource
   * @param append - Whether to append data
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#publish_data_source
   */
  publishDatasource = async ({
    siteId,
    body,
    overwrite,
    append,
  }: {
    siteId: string;
    body: any;
    overwrite?: boolean;
    append?: boolean;
  }): Promise<DataSource> => {
    return (
      await this._apiClient.publishDatasource(body, {
        params: { siteId },
        queries: { overwrite, append },
        ...this.authHeader,
      })
    ).datasource;
  };

  /**
   * Queries connections for a data source.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#query_data_source_connections
   */
  queryDatasourceConnections = async ({
    siteId,
    datasourceId,
  }: {
    siteId: string;
    datasourceId: string;
  }): Promise<DataSourceConnection[]> => {
    const response = await this._apiClient.queryDatasourceConnections({
      params: { siteId, datasourceId },
      ...this.authHeader,
    });
    return response.connections.connection ?? [];
  };

  /**
   * Updates a data source connection.
   *
   * Required scopes: `tableau:datasources:update`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param connectionId - The ID of the connection
   * @param updateRequest - The update request body
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#update_data_source_connection
   */
  updateDatasourceConnection = async ({
    siteId,
    datasourceId,
    connectionId,
    updateRequest,
  }: {
    siteId: string;
    datasourceId: string;
    connectionId: string;
    updateRequest: z.infer<typeof updateDataSourceConnectionRequestSchema>;
  }): Promise<DataSourceConnection> => {
    return (
      await this._apiClient.updateDatasourceConnection(updateRequest, {
        params: { siteId, datasourceId, connectionId },
        ...this.authHeader,
      })
    ).connection;
  };

  /**
   * Gets revisions for a data source.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param pageSize - Number of items per page
   * @param pageNumber - Page number
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#get_data_source_revisions
   */
  getDatasourceRevisions = async ({
    siteId,
    datasourceId,
    pageSize,
    pageNumber,
  }: {
    siteId: string;
    datasourceId: string;
    pageSize?: number;
    pageNumber?: number;
  }): Promise<{ pagination: Pagination; revisions: DataSourceRevision[] }> => {
    const response = await this._apiClient.getDatasourceRevisions({
      params: { siteId, datasourceId },
      queries: { pageSize, pageNumber },
      ...this.authHeader,
    });
    return {
      pagination: response.pagination,
      revisions: response.revisions.revision ?? [],
    };
  };

  /**
   * Downloads a specific revision of a data source.
   *
   * Required scopes: `tableau:content:read`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param revisionNumber - The revision number
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#download_data_source_revision
   */
  downloadDatasourceRevision = async ({
    siteId,
    datasourceId,
    revisionNumber,
  }: {
    siteId: string;
    datasourceId: string;
    revisionNumber: string;
  }): Promise<any> => {
    return await this._apiClient.downloadDatasourceRevision({
      params: { siteId, datasourceId, revisionNumber },
      ...this.authHeader,
    });
  };

  /**
   * Removes a specific revision of a data source.
   *
   * Required scopes: `tableau:datasources:delete`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param revisionNumber - The revision number
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#remove_data_source_revision
   */
  removeDatasourceRevision = async ({
    siteId,
    datasourceId,
    revisionNumber,
  }: {
    siteId: string;
    datasourceId: string;
    revisionNumber: string;
  }): Promise<void> => {
    await this._apiClient.removeDatasourceRevision({
      params: { siteId, datasourceId, revisionNumber },
      ...this.authHeader,
    });
  };

  /**
   * Adds tags to a data source.
   *
   * Required scopes: `tableau:datasource_tags:update`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param tags - Array of tag labels
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#add_tags_to_data_source
   */
  addTagsToDatasource = async ({
    siteId,
    datasourceId,
    tags,
  }: {
    siteId: string;
    datasourceId: string;
    tags: string[];
  }): Promise<Tags> => {
    return (
      await this._apiClient.addTagsToDatasource(
        {
          tags: {
            tag: tags.map((label) => ({ label })),
          },
        },
        {
          params: { siteId, datasourceId },
          ...this.authHeader,
        },
      )
    ).tags;
  };

  /**
   * Deletes a tag from a data source.
   *
   * Required scopes: `tableau:datasource_tags:delete`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param tagName - The tag name to delete
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#delete_tag_from_data_source
   */
  deleteTagFromDatasource = async ({
    siteId,
    datasourceId,
    tagName,
  }: {
    siteId: string;
    datasourceId: string;
    tagName: string;
  }): Promise<void> => {
    await this._apiClient.deleteTagFromDatasource({
      params: { siteId, datasourceId, tagName },
      ...this.authHeader,
    });
  };

  /**
   * Downloads encrypted keychain for migration.
   *
   * Required scopes: `tableau:embedded_credentials:download`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param body - The request body
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#download_data_source_encrypted_keychain
   */
  downloadDatasourceKeychain = async ({
    siteId,
    datasourceId,
    body,
  }: {
    siteId: string;
    datasourceId: string;
    body: any;
  }): Promise<any> => {
    return await this._apiClient.downloadDatasourceKeychain(body, {
      params: { siteId, datasourceId },
      ...this.authHeader,
    });
  };

  /**
   * Uploads encrypted keychain for migration.
   *
   * Required scopes: `tableau:embedded_credentials:upload`
   *
   * @param siteId - The Tableau site ID
   * @param datasourceId - The ID of the data source
   * @param body - The request body
   * @link https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_data_sources.htm#upload_encrypted_keychain
   */
  uploadDatasourceKeychain = async ({
    siteId,
    datasourceId,
    body,
  }: {
    siteId: string;
    datasourceId: string;
    body: any;
  }): Promise<any> => {
    return await this._apiClient.uploadDatasourceKeychain(body, {
      params: { siteId, datasourceId },
      ...this.authHeader,
    });
  };
}
