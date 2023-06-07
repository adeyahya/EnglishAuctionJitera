import { NextApiRequest, NextApiResponse } from "next";

class BaseController {
  get(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  post(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  patch(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  put(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  delete(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
}

export default BaseController;
