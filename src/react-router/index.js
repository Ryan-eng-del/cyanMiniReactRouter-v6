import React, { useMemo } from "react";

export const NavigatorContext = React.createContext();
export const LocationContext = React.createContext();
// const RouteContext = React.createContext();

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
  // console.log(routes, "routes", children);

  return useRoutes(routes);
}

export function Route() {}

export function compilePath(path) {
  const pathnames = [];
  let regexpSource =
    "^" +
    path.replace(/:(\w+)/g, (_, key) => {
      pathnames.push(key);
      return "([^\\/]+?)";
    });
  regexpSource += "$";
  let matcher = new RegExp(regexpSource);
  return [matcher, pathnames];
}

export function matchPath(path, pathname) {
  //pathname: /id/100/20 || matcher /id/([^\/]+?)/([^\/]+?)
  let [matcher, paramNames] = compilePath(path);

  let match = pathname.match(matcher);
  if (!match) return null;
  const matchPathname = match[0];
  let values = match.slice(1);

  let params = paramNames.reduce((memo, paramName, index) => {
    memo[paramName] = values[index];
    return memo;
  }, {});
  return { params, path, pathname: matchPathname };
}

export function useRoutes(routes) {
  let location = useLocation();
  // console.log("useRoutes -- location", location);
  const pathname = location.pathname || "/";
  // debugger;

  for (let index = 0; index < routes.length; index++) {
    const { path, element } = routes[index];
    // console.log(path, element, "path");
    let match = matchPath(path, pathname);
    console.log(match, "match");
    if (match) return element;
  }
  return null;
}

export function useLocation() {
  return React.useContext(LocationContext).location;
}

export function createRoutesChildren(children) {
  let routes = [];
  React.Children.forEach(children, (ele) => {
    let route = { path: ele.props.path, element: ele.props.element };
    routes.push(route);
  });
  return routes;
}
