Your README is looking 🔥 already — here’s a lightly polished version that improves clarity, flow, and formatting while keeping everything in your voice and structure:

---

# Router

### 📦 Types

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

type MiddlewareResult =
	| { continue: true }
	| { continue: false; error: string; code?: number };

type Middleware = (ctx: RouteContext) => MiddlewareResult;

type RegisteredRoute<T = unknown> = {
	name: string;
	schema?: (value: unknown) => boolean | [boolean, string?];
	handler: RouteHandler<T>;
	middleware?: Middleware[];
};
```

---

## 🛠 Route Example

```ts
import { t } from "@rbxts/t";
import {
	defineRoute,
	handleRoute,
	registerRoute,
	registerRoutes,
} from "rest-core";

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

---

## 🧩 Middleware

`rest-core` supports both **global** and **per-route** middleware, giving you control over authentication, permissions, rate limiting, logging, and more.

---

### ✅ Global Middleware

Use `use()` to register middleware that runs on every route:

```ts
import { use } from "rest-core";

use((ctx) => {
	print(`[ROUTER] ${ctx.meta?.route} called by ${ctx.player.Name}`);
	return { continue: true };
});
```

---

### ✅ Route-Specific Middleware

Apply middleware to individual routes:

```ts
import { defineRoute, registerRoute, success } from "rest-core";
import { t } from "@rbxts/t";
import { requireAuth } from "rest-core";

const ProfileSchema = t.interface({});

registerRoute(
	defineRoute(ProfileSchema, {
		name: "profile:get",
		middleware: [requireAuth],
		handler: ({ player }) => {
			return success({ username: player.Name });
		},
	}),
);
```

---

### ✅ Create Custom Middleware

Write your own checks using the `RouteContext`:

```ts
export function requireRole(role: string): Middleware {
	return (ctx) => {
		const userRole = ctx.player.GetAttribute("role");
		return userRole === role
			? { continue: true }
			: { continue: false, error: "Forbidden", code: 403 };
	};
}
```

Use it like this:

```ts
middleware: [requireRole("admin")]
```

---