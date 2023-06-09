import Ajv from "ajv";
import addFormats from "ajv-formats";
import { TSchema } from "@sinclair/typebox";
import { ErrorUnauthorized } from "@/lib/HttpError";

const ajv = new Ajv({ removeAdditional: "all", strict: false });
addFormats(ajv);

class Validator {
  public static createValidator = (dto: TSchema) => {
    const validate = ajv.compile(dto);

    return (data: object) => {
      if (!validate(data)) {
        throw { statusCode: 400, errors: validate.errors };
      }

      return data;
    };
  };
}

export function ValidateBody(schema: TSchema) {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const validateSchema = Validator.createValidator(schema);
    descriptor.value = function (
      ...args: [HttpParams, ApiRequest, ApiResponse]
    ) {
      validateSchema(args?.[0]?.body ?? {});
      return original.apply(this, args);
    };

    return descriptor;
  };
}

export function ValidateResponse(schema: TSchema) {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const validateSchema = Validator.createValidator(schema);
    descriptor.value = async function (
      ...args: [HttpParams, ApiRequest, ApiResponse]
    ) {
      const result = await original.apply(this, args);
      return validateSchema(result);
    };

    return descriptor;
  };
}

export function Auth() {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (
      ...args: [HttpParams, ApiRequest, ApiResponse]
    ) {
      const req = args?.[1];
      req.verifyAuth();
      return original.apply(this, args);
    };

    return descriptor;
  };
}

export default Validator;
