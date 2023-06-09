import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ removeAdditional: "all" });
addFormats(ajv);

class Validator {
  public static createValidator = (dto: object) => {
    const validate = ajv.compile(dto);

    return (data: object) => {
      if (!validate(data)) {
        throw { statusCode: 400, errors: validate.errors };
      }

      return data;
    };
  };
}

export default Validator;
