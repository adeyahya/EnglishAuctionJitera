import UrlPattern from "url-pattern";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import HttpError, { ErrorUnauthorized } from "@/lib/HttpError";
import ms from "ms";

type HttpVerbs = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type RouteHandler = (
  params: HttpParams,
  req: ApiRequest,
  res: ApiResponse
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

  public async eval(req: ApiRequest, res: ApiResponse) {
    if (!req.method) return res.end("not implemented");

    // inject jwt signer
    res.jwtSign = jwt.sign;

    // inject method to set cookie
    res.setCookie = (
      name: string,
      value: string,
      opts?: cookie.CookieSerializeOptions
    ) => {
      const cookieString = cookie.serialize(name, value, opts);
      res.setHeader("Set-Cookie", cookieString);
    };

    res.setAuth = (payload: any) => {
      const token = res.jwtSign(
        payload,
        // TODO: move to envar
        "secret",
        {
          expiresIn: "12h",
        }
      );

      res.setCookie("authToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: ms("12h") / 60,
      });
    };

    req.verifyAuth = () => {
      try {
        const { authToken } = cookie.parse(req.headers.cookie ?? "");
        const payload = jwt.verify(authToken, "secret");
        if (!payload) throw {};
        req.authUser = payload;
      } catch (error) {
        throw ErrorUnauthorized;
      }
    };

    const patterns = Array.from(
      this.routeMap.get(req.method as HttpVerbs) ?? new Set([])
    );

    for (let [pattern, handler] of patterns) {
      const pathString = getPathString(req.query?.path ?? req.url);
      const params = pattern.match(pathString);
      const httpParams: HttpParams = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      if (params) {
        req.params = params;
        return await handler(httpParams, req, res);
      }
    }

    throw new HttpError("Not Implemented", 501);
  }
}

const getPathString = (paths?: string[] | string) => {
  if (!paths) return "/";
  if (typeof paths === "string") return paths;
  return "/" + (paths ?? []).join("/");
};

export default Router;
