import { NextApiRequest, NextApiResponse } from "next";
import UrlPattern from "url-pattern";

type HttpVerbs = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type RouteHandler = (
  params: HttpParams,
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<any>;

class Router {
  private routeMap = new Map<HttpVerbs, Set<[UrlPattern, RouteHandler]>>([
    ["GET", new Set([])],
    ["POST", new Set([])],
    ["PATCH", new Set([])],
    ["PUT", new Set([])],
    ["DELETE", new Set([])],
  ]);
  constructor() {}

  public async get(pattern: string, handler: RouteHandler) {
    this.routeMap.get("GET")?.add([new UrlPattern(pattern), handler]);
  }

  public async post(pattern: string, handler: RouteHandler) {
    this.routeMap.get("POST")?.add([new UrlPattern(pattern), handler]);
  }

  public async patch(pattern: string, handler: RouteHandler) {
    this.routeMap.get("PATCH")?.add([new UrlPattern(pattern), handler]);
  }

  public async put(pattern: string, handler: RouteHandler) {
    this.routeMap.get("PUT")?.add([new UrlPattern(pattern), handler]);
  }

  public async delete(pattern: string, handler: RouteHandler) {
    this.routeMap.get("DELETE")?.add([new UrlPattern(pattern), handler]);
  }

  public async eval(req: NextApiRequest, res: NextApiResponse) {
    if (!req.method) return res.end("not implemented");
    const patterns = Array.from(
      this.routeMap.get(req.method as HttpVerbs) ?? new Set([])
    );

    for (let [pattern, handler] of patterns) {
      const pathString = "/" + ((req.query.path as string[]) ?? []).join("/");
      const params = pattern.match(pathString);
      if (params) {
        // @ts-ignore
        req.params = params;
        return await handler(
          {
            body: req.body,
            query: req.query,
            params: req.params,
          },
          req,
          res
        );
      }
    }

    return res.status(501).end("not implemented");
  }
}

export default Router;
