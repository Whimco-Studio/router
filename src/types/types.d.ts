type RouteContext<T = unknown> = {
	player: Player;
	payload: T;
	meta?: {
		route: string;
		timestamp: number;
		[key: string]: unknown;
	};
};

type RouteHandler<T = unknown> = (ctx: RouteContext<T>) => unknown;

type MiddlewareResult = { continue: true } | { continue: false; error: string; code?: number };

type Middleware = (ctx: RouteContext) => MiddlewareResult;

type RegisteredRoute<T = unknown> = {
	name: string;
	schema?: (value: unknown) => boolean | [boolean, string?];
	handler: RouteHandler<T>;
	middleware?: Middleware[];
};

type InferTType<T> = T extends (val: unknown) => val is infer R
	? R
	: T extends (val: unknown) => [true, infer R]
		? R
		: T extends (val: unknown) => boolean | [boolean, string?]
			? unknown
			: never;

type RegisteredRouteFromSchema<S extends (val: unknown) => unknown> = {
	name: string;
	schema: S;
	middleware?: Middleware[];
	handler: RouteHandler<InferTType<S>>;
};
