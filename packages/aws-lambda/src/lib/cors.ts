import {APIGatewayProxyEventV2,APIGatewayProxyStructuredResultV2} from "aws-lambda";
import {HttpStatusCode} from "./http-status-code";

export interface CorsProps {
  readonly allowOrigins?: (string|RegExp)[];
  readonly allowMethods?: (string|RegExp)[];
  readonly allowHeaders?: (string|RegExp)[];
  readonly allowCredentials?: boolean;
}

export class Cors {

  readonly allowOrigins: (string|RegExp)[];
  readonly allowMethods: (string|RegExp)[];
  readonly allowHeaders: (string|RegExp)[];
  readonly allowCredentials: boolean;

  constructor(props: CorsProps) {
    this.allowOrigins = props.allowOrigins ?? ["*"];
    this.allowMethods = props.allowMethods ?? ["*"];
    this.allowHeaders = props.allowHeaders ?? ["*"];
    this.allowCredentials = props.allowCredentials ?? false;
  }

  headers(event: APIGatewayProxyEventV2): Record<string, string> {
    const origin = event.headers["origin"];
    const record = {}
    if (origin !== undefined) {
      for (let allowOrigin of this.allowOrigins) {
        if (allowOrigin === "*" || allowOrigin === origin
            || (typeof allowOrigin !== "string" && origin.match(allowOrigin))) {
          record["Access-Control-Allow-Origin"] = origin;
          record["Access-Control-Allow-Headers"] = this.allowHeaders.join(",");
          record["Access-Control-Allow-Methods"] = this.allowMethods.join(",");
          if (this.allowCredentials) {
            record["Access-Control-Allow-Credentials"] = "true"
          }
          return record;
        }
      }
    }
    return record;
  }

  augment(event: APIGatewayProxyEventV2, response: APIGatewayProxyStructuredResultV2): APIGatewayProxyStructuredResultV2 {
    if (response.headers === undefined) {
      response.headers = {}
    }
    response.headers = {
      ...this.headers(event),
      ...response.headers
    }
    return response;
  }

  optionsResponse(event: APIGatewayProxyEventV2): APIGatewayProxyStructuredResultV2 {
    return {
      statusCode: HttpStatusCode.OK,
      headers: {
        ...this.headers(event)
      }
    }
  }
}
