import "./core/router";
import { createRouterServer } from "./utils/routerBridge";

export * from "./core/router";
export * from "./core/middleware";
export * from "./core/permissions";
export * from "./core/context";
export * from "./core/responses";
export * from "./plugins/signal";
export * from "./utils/deepClone";
export * from "./utils/routerBridge";

export type RegisteredRoutesMap = Record<
	string,
	{
		schema: (value: unknown) => boolean | [boolean, string?];
	}
>;

export type RouteContext<T = unknown> = {
	player: Player;
	payload: T;
	meta?: {
		route: string;
		timestamp: number;
		[key: string]: unknown;
	};
};

export type RouteHandler<T = unknown> = (ctx: RouteContext<T>) => unknown;

export type MiddlewareResult = { continue: true } | { continue: false; error: string; code?: number };

export type Middleware = (ctx: RouteContext) => MiddlewareResult;

export type RegisteredRoute<T = unknown> = {
	name: string;
	schema?: (value: unknown) => boolean | [boolean, string?];
	handler: RouteHandler<T>;
	middleware?: Middleware[];
};

export type InferTType<T> = T extends (val: unknown) => val is infer R
	? R
	: T extends (val: unknown) => [true, infer R]
		? R
		: T extends (val: unknown) => boolean | [boolean, string?]
			? unknown
			: never;

export type RegisteredRouteFromSchema<S extends (val: unknown) => unknown> = {
	name: string;
	schema: S;
	middleware?: Middleware[];
	handler: RouteHandler<InferTType<S>>;
};

createRouterServer();
