import {APIGatewayProxyEventV2} from "aws-lambda";
import {notEmpty, ValidationError} from "@truemark/apk-validator";

const BASE64 = "base64";
const UTF8 = "utf8";

export function parseJsonBody(event: APIGatewayProxyEventV2): any {
  notEmpty("body", event.body);
  try {
    if (event.isBase64Encoded) {
      return JSON.parse(Buffer.from(event.body, BASE64).toString(UTF8));
    } else {
      return JSON.parse(event.body);
    }
  } catch (error) {
    throw new ValidationError("Unable to parse body as JSON");
  }
}
