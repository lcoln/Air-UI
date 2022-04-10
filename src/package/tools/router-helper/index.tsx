// @ts-nocheck
/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import lazy, { AsyncType } from '../async-component';

interface PageRouter {
  id: number;
  path: string;
  component?: AsyncType;
  parent?: string;
  children?: Array<PageRouter>;
  layout?: AsyncType;
  config?: {
    redirects?: any;
  };
}

// 根据pageRouter提供的路由数据结构，将组件进行按需引用优化
function initRoute(pageRouter: PageRouter) {
  if (pageRouter.layout) {
    pageRouter.layout = lazy(pageRouter.layout);
  }
  if (pageRouter.component) {
    pageRouter.component = lazy(pageRouter.component);
  }
  if (pageRouter.children) {
    pageRouter.children = pageRouter.children.map(initRoute).filter((v: PageRouter) => v);
  }
  return pageRouter;
}

// 将路由进行过滤后返回
function routeFilter(Page: any, pageConfig: any, props: any, routePath: any) {
  // console.log({ routePath });
  // const NotFound = pageConfig['404'];
  return !pageConfig.filter || pageConfig.filter(props, routePath)
    ? Page
    : null;
}

// function routeFilter(Page: any, pageConfig: any, props: any, routePath: any) {
//   if (!pageConfig.filter) {
//     return Page;
//   }
//   if (typeof pageConfig.filter === 'function') {
//     const res = pageConfig.filter(props, routePath);
//     if (React.isValidElement(res)) {
//       return res;
//     }
//     if (Object.prototype.toString.call(res) === '[object Boolean]') {
//       console.log('[object Boolean]');
//       return res ? Page : null;
//     }
//   }
//   return null;
// }

// 将当前route的config合并到props里
function concatProps(rootProps: any, item: any, curProps: any) {
  return {
    ...rootProps,
    ...(item.config && { pageConfig: item.config }),
    ...curProps,
  };
}

const PageContext = React.createContext<object>({
  value: {},
});

function reducePage(page: PageRouter, pageConfig: object, props = {}) {
  // 子路由
  const child = page.children ? page.children.map((item: PageRouter) => {
    const curProps = concatProps(props, item, {});

    return routeFilter(<Route
      // exact
      path={item.path}
      key={item.id}
      render={(p: any) => reducePage(item, pageConfig, concatProps(props, item, p))}
      {...curProps}
    />, pageConfig, curProps, item.path);
  }) : [];

  // 当前路由
  const curProps = concatProps(props, page, {});

  const component = page.component ? routeFilter(<Route
    exact
    path={page.path}
    key={page.id}
    render={() => <page.component {...curProps} />}
  />, pageConfig, curProps, page.path) : [];

  // 重定向路由组件
  let redirects = [];
  if (page?.config && page.config.redirects) {
    redirects = page.config.redirects.map((item: any) => (
      <Redirect
        // exact
        key={`${item.from}_${item.to}`}
        from={item.from}
        to={item.to}
      />
    ));
  }
  let result = (
    <Switch>
      { redirects }
      { child }
      { component }
      <Redirect to={pageConfig?.error?.['404'] || '/error/404'} />
      <Redirect
        to="/"
      />
    </Switch>
  );
  if (page.layout) {
    result = <page.layout pageConfig={page.config || {}}>{result}</page.layout>;
  }

  result = (
    <PageContext.Provider
      value={{
        value: page,
      }}
    >
      {result}
    </PageContext.Provider>
  );
  return result;
}

function routerHelper(pageRouter: PageRouter, config: object, props = {}) {
  pageRouter = initRoute(pageRouter);
  const routeArr = reducePage(pageRouter, config, props);
  console.log({ pageRouter });
  return routeArr;
}

export default routerHelper;