function compilePath(path) {
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

function matchPath(path, pathname) {
  //pathname: /id/100/20 || matcher /id/([^\/]+?)/([^\/]+?)
  let [matcher, paramNames] = compilePath(path);

  let match = pathname.match(matcher);
  const matchPathname = match[0];
  let values = match.slice(1);
  if (!match) return null;
  let params = paramNames.reduce((memo, paramName, index) => {
    memo[paramName] = values[index];
    return memo;
  }, {});
  console.log(params, "params");
  return { params, path, pathname };
}
matchPath("/id/:path/:name", "/id/1/2");
