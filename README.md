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


Example
```ts
import { t } from "@rbxts/t";
import { defineRoute, handleRoute, registerRoute, registerRoutes } from "../core/router";

const ExampleSchema = t.interface({
	name: t.string,
	age: t.number,
});

registerRoute(
	defineRoute(ExampleSchema, {
		name: "example_1",
		handler: ({ payload }) => {
			print(payload.name);
		},
	}),
);

registerRoutes("example_2", [
	defineRoute(ExampleSchema, {
		name: "check age",
		handler: ({ payload }) => {
			print(payload.age);
		},
	}),
	defineRoute(ExampleSchema, {
		name: "create",
		handler: ({ payload }) => {
			print(payload); // { age: 10, name: "test" }
		},
	}),
]);

handleRoute("example_2:create", game.GetService("Players").LocalPlayer, {
	age: 10,
	name: "test",
});
```