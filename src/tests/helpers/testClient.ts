import { createServer, RequestListener } from "http";
import gatewaysHandler from "../../pages/api/[...path]";
import { apiResolver } from "next/dist/server/api-utils/node";
import request from "supertest";

const testClient = () => {
  const listener: RequestListener = (req, res) => {
    return apiResolver(
      req,
      res,
      undefined,
      gatewaysHandler,
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
