import Ajv from "ajv";
import addFormats from "ajv-formats";
import { NextApiHandler, NextApiRequest } from "next";
import { TSchema } from "@sinclair/typebox";

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
      ...args: [HttpParams, NextApiRequest, NextApiHandler]
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
      ...args: [HttpParams, NextApiRequest, NextApiHandler]
    ) {
      const result = await original.apply(this, args);
      return validateSchema(result);
    };

    return descriptor;
  };
}

export default Validator;
