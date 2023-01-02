import middy, {MiddyfiedHandler} from "@middy/core";
import {
  ALBEvent,
  ALBResult, APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
  Context
} from "aws-lambda";
import {Callback, Handler as LambdaHandler} from "aws-lambda/handler";
import {createError} from "@middy/util";

export type HttpMethod = "HEAD" | "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "ANY";

type TResult = ALBResult | APIGatewayProxyResult | APIGatewayProxyResultV2;

type THandler<TEvent> = LambdaHandler<TEvent, TResult> | MiddyfiedHandler<TEvent, TResult, any, any>;

type TPath = (string|RegExp)[] | string | RegExp
type TContentType = (string|RegExp)[] | string | RegExp;

export interface Route<TEvent> {
  readonly method: HttpMethod[] | HttpMethod;
  readonly path: TPath;
  readonly contentType?: TContentType;
  readonly handler: THandler<TEvent>;
}

export interface IRoute<TEvent> {
  readonly method: HttpMethod
  readonly path: string | RegExp;
  readonly contentType: string | RegExp | undefined;
  readonly handler: THandler<TEvent>;
}

function isAPIGatewayProxyEventV2(event: any): event is APIGatewayProxyEventV2 {
  return (event as APIGatewayProxyEventV2).version !== undefined && event.version === "2.0";
}


export function httpRouterHandler<TEvent extends ALBEvent | APIGatewayProxyEvent | APIGatewayProxyEventV2>(routes: Route<TEvent>[]): MiddyfiedHandler {

  const staticPathStaticContentRoutes: Record<string, Record<string, Record<string, IRoute<TEvent>>>> = {
    "HEAD": {}, "GET": {}, "POST": {}, "PUT": {}, "DELETE": {}, "OPTIONS": {}}; // method, path, content-type
  const staticPathDynamicContentRoutes: Record<string, Record<string, IRoute<TEvent>[]>> = {
    "HEAD": {}, "GET": {}, "POST": {}, "PUT": {}, "DELETE": {}, "OPTIONS": {}}; // method, path
  const dynamicPathStaticContentRoutes: Record<string, Record<string, IRoute<TEvent>[]>> = {
    "HEAD": {}, "GET": {}, "POST": {}, "PUT": {}, "DELETE": {}, "OPTIONS": {}}; // method, content-type
  const dynamicPathDynamicContentRoutes: Record<string, IRoute<TEvent>[]> = {};

  for (const route of routes) {
    const handler = route.handler;
    for (const method of Array.isArray(route.method) ? route.method : [route.method]) {
      for (const path of Array.isArray(route.path) ? route.path : [route.path]) {
        for (const contentType of route.contentType ? (Array.isArray(route.contentType) ? route.contentType : [route.contentType]) : ["*"]) {
          const iRoute = {method, path, contentType, handler}
          if (typeof path === "string" && typeof contentType === "string") {
            if (!staticPathStaticContentRoutes[method][path]) {
              staticPathStaticContentRoutes[method][path] = {};
            }
            if (staticPathStaticContentRoutes[method][path][contentType]) {
              throw new Error(`Route method: ${method}, path: ${path}, contentType: ${contentType} already exists`);
            } else {
              staticPathStaticContentRoutes[method][path][contentType] = iRoute
            }
          } else if (typeof path === "string" && contentType instanceof RegExp) {
            staticPathDynamicContentRoutes[method][path] = [].concat(...staticPathDynamicContentRoutes[method][path], iRoute);
          } else if (path instanceof RegExp && typeof contentType === "string") {
            dynamicPathStaticContentRoutes[method][contentType] = [].concat(...dynamicPathStaticContentRoutes[method][contentType], iRoute);
          } else if (path instanceof RegExp && contentType instanceof RegExp) {
            dynamicPathDynamicContentRoutes[method] = [].concat(...dynamicPathDynamicContentRoutes[method], iRoute);
          } else {
            throw new Error("Error configuring routes");
          }
        }
      }
    }
  }

  return middy().handler(async (event: TEvent, context: Context, callback: Callback<TResult>): Promise<TResult | void> => {
    if (!isAPIGatewayProxyEventV2(event)) {
      throw new Error("Event type is not APIGatewayProxyEventV2");
    }

    const method: string = event.requestContext.http.method;
    const path: string = event.requestContext.http.path;
    const contentType: string = event.headers["content-type"] ? event.headers["content-type"] : "*";

    let route: IRoute<TEvent> | undefined = undefined;

    // string match for method, path and content-type
    if (staticPathStaticContentRoutes[method][path]) {
      route = staticPathStaticContentRoutes[method][path][contentType];
      if (route === undefined) {
        route = staticPathStaticContentRoutes[method][path]["*"];
      }
    }

    if (route === undefined) {
      // string match for method, path and RegExp match for content-type
      if (staticPathDynamicContentRoutes[method]) {
        for (const r of staticPathDynamicContentRoutes[method][path] ?? []) {
          if ((r.contentType as RegExp).test(contentType)) {
            route = r;
            break;
          }
        }
      }

    }
    if (route === undefined) {
      // string match for method, content-type and RegExp match for path
      if (dynamicPathStaticContentRoutes[method]) {
        let rs = dynamicPathStaticContentRoutes[method][contentType];
        if (rs === undefined) {
          rs = dynamicPathStaticContentRoutes[method]["*"];
        }
        if (rs) {
          for (const r of rs) {
            if ((r.path as RegExp).test(path)) {
              route = r;
              break;
            }
          }
        }
      }
    }
    if (route === undefined) {
      // string match for method, RegExp match for path and content-type
      for (const r of dynamicPathDynamicContentRoutes[method] ?? []) {
        if ((r.path as RegExp).test(path) && (r.contentType as RegExp).test(contentType)) {
          route = r;
          break;
        }
      }
    }
    if (route === undefined) {
      throw createError(404, "Not found");
    }

    return route.handler(event, context, callback);
  });
}
