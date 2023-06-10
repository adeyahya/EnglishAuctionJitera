import resetDb from "./resetDb";
import { beforeEach } from "vitest";

beforeEach(async () => {
  await resetDb();
});
