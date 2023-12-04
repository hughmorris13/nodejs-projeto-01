export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-z]+)/g
  const pathWithParamsRegex = path.replaceAll(routeParametersRegex, '(?<$1>[a-zA-z0-9\-_]+)')
  const pathRegex = new RegExp(`^${pathWithParamsRegex}(?<query>\\?(.*))?$`)

  return pathRegex;
}