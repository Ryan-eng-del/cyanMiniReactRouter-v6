import React, { useMemo } from "react";

const NavigatorContext = React.createContext();
const LocationContext = React.createContext();
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
  let regexpSource = "^" + path;
  regexpSource += "$";
  let matcher = new RegExp(regexpSource);
  return matcher;
}

export function matchPath(path, pathname) {
  let matcher = compilePath(path);
  let match = pathname.match(matcher);
  if (!match) return null;
  else return match;
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
