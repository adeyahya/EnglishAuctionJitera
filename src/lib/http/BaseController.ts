import { NextApiRequest, NextApiResponse } from "next";

class BaseController {
  async get(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  async post(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  async patch(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  async put(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
  async delete(_: NextApiRequest, res: NextApiResponse) {
    res.status(501).end("Not Implemented");
  }
}

export default BaseController;
