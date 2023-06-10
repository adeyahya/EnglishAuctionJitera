import { createServer, RequestListener } from "http";
import { apiResolver } from "next/dist/server/api-utils/node";
import request from "supertest";

const testClient = (handler: (req: ApiRequest, res: ApiResponse) => void) => {
  const listener: RequestListener = (req, res) => {
    return apiResolver(
      req,
      res,
      undefined,
      handler,
      {
        previewModeEncryptionKey: "",
        previewModeId: "",
        previewModeSigningKey: "",
      },
      false
    );
  };

  return request(createServer(listener));
};

export default testClient;
