import { parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import UrlPattern from "url-pattern";
import jwt from "jsonwebtoken";
import HttpError from "@/lib/HttpError";

const UnauthorizedError = new HttpError("Not Authorized", 401);

type HttpVerbs = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type RouteHandler = (
  params: HttpParams,
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<any>;

type RouteOptions = {
  isProtected?: boolean;
};

class Router {
  private routeMap = new Map<
    HttpVerbs,
    Set<[UrlPattern, RouteHandler, RouteOptions | undefined]>
  >([
    ["GET", new Set([])],
    ["POST", new Set([])],
    ["PATCH", new Set([])],
    ["PUT", new Set([])],
    ["DELETE", new Set([])],
  ]);
  constructor() {}

  public async get(
    pattern: string,
    handler: RouteHandler,
    options?: RouteOptions
  ) {
    this.routeMap.get("GET")?.add([new UrlPattern(pattern), handler, options]);
  }

  public async post(
    pattern: string,
    handler: RouteHandler,
    options?: RouteOptions
  ) {
    this.routeMap.get("POST")?.add([new UrlPattern(pattern), handler, options]);
  }

  public async patch(
    pattern: string,
    handler: RouteHandler,
    options?: RouteOptions
  ) {
    this.routeMap
      .get("PATCH")
      ?.add([new UrlPattern(pattern), handler, options]);
  }

  public async put(
    pattern: string,
    handler: RouteHandler,
    options?: RouteOptions
  ) {
    this.routeMap.get("PUT")?.add([new UrlPattern(pattern), handler, options]);
  }

  public async delete(
    pattern: string,
    handler: RouteHandler,
    options?: RouteOptions
  ) {
    this.routeMap
      .get("DELETE")
      ?.add([new UrlPattern(pattern), handler, options]);
  }

  public async eval(req: NextApiRequest, res: NextApiResponse) {
    if (!req.method) return res.end("not implemented");
    const patterns = Array.from(
      this.routeMap.get(req.method as HttpVerbs) ?? new Set([])
    );

    for (let [pattern, handler, options] of patterns) {
      const pathString = "/" + ((req.query.path as string[]) ?? []).join("/");
      const params = pattern.match(pathString);
      const httpParams: HttpParams = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      if (params) {
        req.params = params;
        if (options?.isProtected) {
          try {
            const { authToken } = parse(req.headers.cookie ?? "");
            // TODO: store secret into envar
            const payload = jwt.verify(authToken, "secret");
            if (!payload) throw {};

            httpParams.auth = payload;
          } catch (error) {
            throw UnauthorizedError;
          }
        }

        return await handler(httpParams, req, res);
      }
    }

    return res.status(501).end("not implemented");
  }
}

export default Router;
