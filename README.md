# Router

Types

```ts
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
```