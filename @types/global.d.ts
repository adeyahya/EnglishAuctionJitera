import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    params: any;
  }
}

declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
  interface HttpParams {
    body: NextApiRequest["body"];
    params: NextApiRequest["params"];
    query: NextApiRequest["query"];
    auth?: any;
  }
}
