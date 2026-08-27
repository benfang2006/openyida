/**
 * FORM_PACKAGE_VIEW 权限组的安全分页读取。
 */

'use strict';

const { CliError } = require('../core/cli-error');
const { createYidaClient } = require('../core/yida-client');

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_MAX_PAGES = 50;

function fetchPermitPackagePage(appType, formUuid, authRef, pageIndex = 1, pageSize = DEFAULT_PAGE_SIZE) {
  return createYidaClient({ authRef }).get(
    `/${appType}/permission/manage/listPermitPackages.json`,
    {
      _api: 'Permission.getPermitGroupList',
      _mock: 'false',
      _locale_time_zone_offset: '28800000',
      formUuid,
      packageName: '',
      packageType: 'FORM_PACKAGE_VIEW',
      pageIndex: String(pageIndex),
      pageSize: String(pageSize),
      appType,
      _stamp: String(Date.now()),
    }
  );
}

function unwrapPermitPackagePage(result) {
  if (!result || result.__needLogin || result.success === false) {
    throw new CliError(result && result.errorMsg || '权限组查询失败', {
      code: result && result.__needLogin ? 'NEED_LOGIN' : 'PERMISSION_LIST_FAILED',
      details: result || { success: false },
    });
  }
  const packages = result.content && result.content.formPermit;
  if (packages === undefined || packages === null) {
    return [];
  }
  if (!Array.isArray(packages)) {
    throw new CliError('权限组查询返回了无法识别的列表结构', {
      code: 'PERMISSION_LIST_INVALID',
      details: { contentType: typeof packages },
    });
  }
  return packages;
}

async function fetchAllPermitPackages(appType, formUuid, authRef, options = {}) {
  const pageSize = options.pageSize || DEFAULT_PAGE_SIZE;
  const maxPages = options.maxPages || DEFAULT_MAX_PAGES;
  const packages = [];
  const seenUuids = new Set();

  for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
    const page = unwrapPermitPackagePage(
      await fetchPermitPackagePage(appType, formUuid, authRef, pageIndex, pageSize)
    );
    for (const permitPackage of page) {
      const packageUuid = permitPackage && permitPackage.packageUuid;
      if (packageUuid) {
        if (seenUuids.has(packageUuid)) {
          throw new CliError(`权限组分页结果重复出现 packageUuid=${packageUuid}`, {
            code: 'PERMISSION_LIST_DUPLICATE_UUID',
            details: { packageUuid, pageIndex },
          });
        }
        seenUuids.add(packageUuid);
      }
      packages.push(permitPackage);
    }
    if (page.length < pageSize) {
      return { packages, pageSize, pagesFetched: pageIndex, complete: true };
    }
  }

  throw new CliError(`权限组查询达到安全分页上限（${maxPages} 页），无法证明结果完整`, {
    code: 'PERMISSION_LIST_INCOMPLETE',
    details: { pageSize, maxPages, returned: packages.length },
  });
}

module.exports = {
  DEFAULT_MAX_PAGES,
  DEFAULT_PAGE_SIZE,
  fetchPermitPackagePage,
  fetchAllPermitPackages,
  unwrapPermitPackagePage,
};
