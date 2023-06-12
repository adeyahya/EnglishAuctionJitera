import type { NextApiRequest, NextApiResponse } from "next";
import type { SignOptions } from "jsonwebtoken";
import type { CookieSerializeOptions } from "cookie";

declare module "next" {
  interface NextApiRequest {
    params: any;
  }
}

declare module "@hookform/resolvers/ajv" {
  export type Resolver = <T>(
    schema: any,
    schemaOptions?: Ajv.Options,
    factoryOptions?: {
      mode?: "async" | "sync";
    }
  ) => <TFieldValues extends FieldValues, TContext>(
    values: TFieldValues,
    context: TContext | undefined,
    options: ResolverOptions<TFieldValues>
  ) => Promise<ResolverResult<TFieldValues>>;
}

declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
  interface HttpParams {
    body: NextApiRequest["body"];
    params: NextApiRequest["params"];
    query: NextApiRequest["query"];
  }

  interface ApiRequest extends NextApiRequest {
    params: any;
    verifyAuth: () => any;
    authUser?: any;
  }

  interface ApiResponse extends NextApiResponse {
    jwtSign: (payload: any, secret: string, opts?: SignOptions) => string;
    setCookie: (
      name: string,
      value: string,
      opts?: CookieSerializeOptions
    ) => void;
    broadcastMessage: (message: string, payload: any) => void;
    /**
     * automatically generate jwt token and inject it to cookie
     * using httpOnly and secure mode. it will be compatible
     * with Auth decorator
     * @returns void
     */
    setAuth: (payload: any) => void;
  }
}
