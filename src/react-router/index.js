import React, { useMemo } from "react";
import { useNavigate } from "../react-router-dom";

export const NavigatorContext = React.createContext();
export const LocationContext = React.createContext();
export const RouteContext = React.createContext();

export function Router({ children, location, navigator }) {
  // console.log(location, navigator, "Router arguments");
  const navigatorContext = useMemo(() => ({ navigator }), [navigator]);
  const locationContext = useMemo(() => ({ location }), [location]);
  // console.log(location, "location");
  return (
    <NavigatorContext.Provider value={navigatorContext}>
      <LocationContext.Provider value={locationContext} children={children} />
    </NavigatorContext.Provider>
  );
}

export function Routes({ children }) {
  const routes = createRoutesChildren(children);
  console.log(routes, "routes");
  return useRoutes(routes);
}

export function useOutlet() {
  const { outlet } = React.useContext(RouteContext);
  if (outlet) {
    return outlet;
  }
  return null;
}

export function Outlet() {
  return useOutlet();
}

export function Route() {}

export function compilePath(path, end) {
  const pathnames = [];

  let regexpSource =
    "^" +
    path
      .replace(/\/*\*?$/, "")
      .replace(/^\/*/, "/")
      .replace(/:(\w+)/g, (_, key) => {
        pathnames.push(key);
        return "([^\\/]+?)";
      });
  // debugger;
  if (path.endsWith("*")) {
    pathnames.push("*");
    regexpSource += "(?:\\/(.+)|\\/*)$";
  } else {
    regexpSource += end ? "\\/*$" : "(?:\b|\\/|$)";
  }
  let matcher = new RegExp(regexpSource);
  return [matcher, pathnames];
}

export function matchPath({ path, end }, pathname) {
  //pathname: /id/100/20 || matcher /id/([^\/]+?)/([^\/]+?)
  /* 路径编译为正则 */
  let [matcher, paramNames] = compilePath(path, end);

  let match = pathname.match(matcher);
  if (!match) return null;
  const matchPathname = match[0];
  // debugger;
  let pathnameBase = matchPathname.replace(/(.)\/+$/, "$1");
  let values = match.slice(1);
  let captureGroups = match.slice(1);
  /* 拼出paramsNames对象 */
  let params = paramNames.reduce((memo, paramName, index) => {
    if (paramName === "*") {
      let splitValue = captureGroups[index] || "";
      /* 截取*之前的作为父串 */
      pathnameBase = matchPathname
        .slice(0, matchPathname.length - splitValue.length)
        .replace(/(.)\/+$/, "$1");
    }
    memo[paramName] = values[index];
    return memo;
  }, {});
  return { params, path, pathname: matchPathname, pathnameBase };
}

export function useRoutes(routes) {
  /* routes 支持配置式路由 */

  let location = useLocation();
  // debugger;
  /* 用当前的地址栏当中的路径和路由进行匹配 */
  const matches = matchRoutes(routes, location);
  return _renderMatches(matches);
}

export function _renderMatches(matches) {
  return matches.reduceRight((outlet, match) => {
    return (
      <RouteContext.Provider value={{ outlet }}>
        {match.route.element}
      </RouteContext.Provider>
    );
  }, null);
}

export function matchRoutes(routes, location) {
  let pathname = location.pathname;
  /* flat所有嵌套的routes */
  let branches = flattenRoutes(routes);
  console.log(branches, "branches");
  let matches = null;
  for (let index = 0; !matches && index < branches.length; index++) {
    matches = matchRouteBranch(branches[index], pathname);
  }
  console.log(matches, "matches");
  return matches;
}

function matchRouteBranch(branch, pathname) {
  let { routesMeta } = branch;
  let matchParams = {};
  let mathedPathname = "/";
  let matches = [];
  for (let index = 0; index < routesMeta.length; index++) {
    const meta = routesMeta[index];
    let end = index === routesMeta.length - 1;
    /* 获取剩下的将要匹配的路径 */
    let remainingPathname =
      mathedPathname === "/" ? pathname : pathname.slice(mathedPathname.length);
    let match = matchPath({ path: meta.relativePath, end }, remainingPathname);
    if (!match) return null;
    Object.assign(matchParams, match.params);
    let route = meta.route;

    matches.push({
      params: matchParams,
      pathname: joinPaths([mathedPathname, match.pathname]),
      pathnameBase: joinPaths([mathedPathname, match.pathnameBase]),
      route,
    });

    if (match.pathnameBase !== "/") {
      mathedPathname = joinPaths([mathedPathname, match.pathnameBase]);
    }
  }
  return matches;
}

export function flattenRoutes(
  routes,
  branches = [],
  parentMeta = [],
  parentPath = ""
) {
  // debugger;
  routes.forEach((route) => {
    /* 定义路由元数据 */
    let meta = {
      relativePath: route.path || "",
      route,
    };
    //  父路径加上自己的相对路径匹配出完整的路径
    let path = joinPaths([parentPath, meta.relativePath]);
    /* 父meta数组当中添加自己的meta */
    let routesMeta = parentMeta.concat(meta);
    // debugger;
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path);
    }

    branches.push({
      path,
      routesMeta,
    });
  });
  return branches;
}

function joinPaths(paths) {
  //["/user/*/", "/add"] join => /user/*///add replace => /user/*/add
  return paths.join("/").replace(/\/+/g, "/");
}

export function useLocation() {
  return React.useContext(LocationContext).location;
}

export function createRoutesChildren(children) {
  let routes = [];

  React.Children.forEach(children, (ele) => {
    let route = { path: ele.props.path, element: ele.props.element };
    if (ele.props.children) {
      route.children = createRoutesChildren(ele.props.children);
    }
    routes.push(route);
  });
  return routes;
}

export function Navigate({ to }) {
  let navigate = useNavigate();
  React.useLayoutEffect(() => navigate(to));
  return null;
}
