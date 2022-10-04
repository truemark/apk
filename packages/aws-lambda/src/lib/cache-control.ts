import {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2} from "aws-lambda";

export class CacheControl {

  protected headerValues: Record<string, number | null> = {};

  maxAge(age: number): CacheControl {
    this.headerValues["max-age"] = age;
    return this;
  }

  sMaxAge(age: number): CacheControl {
    this.headerValues["s-max-age"] = age;
    return this;
  }

  noCache(): CacheControl {
    delete this.headerValues["max-age"];
    delete this.headerValues["s-max-age"];
    this.headerValues["no-cache"] = null;
    return this;
  }

  mustRevalidate(): CacheControl {
    this.headerValues["must-revalidate"] = null;
    return this;
  }

  proxyRevalidate(): CacheControl {
    this.headerValues["proxy-revalidate"] = null;
    return this;
  }

  noStore(): CacheControl {
    this.headerValues["no-store"] = null;
    return this;
  }

  setPrivate(): CacheControl {
    delete this.headerValues["private"];
    this.headerValues["private"] = null;
    return this;
  }

  setPublic(): CacheControl {
    delete this.headerValues["public"];
    this.headerValues["public"] = null;
    return this;
  }

  mustUnderstood(): CacheControl {
    this.headerValues["must-understood"] = null;
    this.noStore(); // best practice
    return this;
  }

  noTransform(): CacheControl {
    this.headerValues["no-transform"] = null;
    return this;
  }

  immutable(): CacheControl {
    this.headerValues["immutable"] = null;
    return this;
  }

  staleWhileRevalidate(age: number): CacheControl {
    this.headerValues["stale-while-revalidate"] = age;
    return this;
  }

  staleIfError(age: number): CacheControl {
    this.headerValues["stale-if-error"] = age;
    return this;
  }

  headerValue(): string {
    return Object.keys(this.headerValues).reduce((a, b) => {
      return (a === "" ? "" : `${a},`) + (this.headerValues[b] === null ? b : `${b}=${this.headerValues[b]}`);
    }, "");
  }

  headers(): Record<string, string> {
    return {
      "Cache-Control": this.headerValue()
    }
  }

  augment(event: APIGatewayProxyEventV2, response: APIGatewayProxyStructuredResultV2): APIGatewayProxyStructuredResultV2 {
    if (response.headers === undefined) {
      response.headers = {}
    }
    response.headers = {
      ...this.headers(),
      ...response.headers
    }
    return response;
  }
}
