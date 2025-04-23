import type { t } from "@rbxts/t";
import { ObjectUtilities } from "@rbxts/luau-polyfill";
import type { Middleware, RegisteredRoute, RegisteredRouteFromSchema, RouteContext } from "..";

const routeRegistry = new Map<string, RegisteredRoute<unknown>>();
const globalMiddlewares: Middleware[] = [];

/**
 * Define a route with a t.interface schema and infer its payload type automatically
 */
export function defineRoute<S extends (val: unknown) => boolean | [boolean, string?]>(
	schema: S,
	route: Omit<RegisteredRoute<t.static<typeof schema>>, "schema">,
): RegisteredRoute<t.static<typeof schema>> & { schema: S } {
	const newRoute = {
		name: route.name,
		handler: route.handler,
		middleware: route.middleware,
		schema,
	};
	warn(newRoute);
	return newRoute;
}

/**
 * Register a single route (generic or from defineRoute)
 */
export function registerRoute<S extends (val: unknown) => unknown>(route: RegisteredRouteFromSchema<S>) {
	if (routeRegistry.has(route.name)) {
		warn(`[rest-core] Route "${route.name}" already registered.`);
	}
	routeRegistry.set(route.name, route as RegisteredRoute<unknown>);
}

/**
 * Register multiple routes under a namespace
 */
export function registerRoutes<S extends (val: unknown) => unknown>(
	namespace: string,
	routes: RegisteredRouteFromSchema<S>[],
) {
	for (const route of routes) {
		registerRoute({
			...route,
			name: `${namespace}:${route.name}`,
		});
	}
}

/**
 * Add a global middleware
 */
export function use(middleware: Middleware) {
	globalMiddlewares.push(middleware);
}

/**
 * Handle a route call
 */
export function handleRoute(name: string, player: Player, payload: unknown) {
	const route = routeRegistry.get(name);
	if (!route) return { success: false, error: `Route "${name}" not found`, code: 404 };

	const ctx: RouteContext = {
		player,
		payload,
		meta: {
			route: name,
			timestamp: tick(),
		},
	};

	for (const mw of globalMiddlewares) {
		const result = mw(ctx);
		if (!result.continue) return { success: false, error: result.error, code: result.code ?? 403 };
	}

	if (route.middleware) {
		for (const mw of route.middleware) {
			const result = mw(ctx);
			if (!result.continue) return { success: false, error: result.error, code: result.code ?? 403 };
		}
	}

	if (route.schema) {
		const result = route.schema(payload);
		const isValid = typeIs(result, "boolean") ? result : result[0];
		if (!isValid) return { success: false, error: "Invalid payload", code: 400 };
	}

	return route.handler(ctx);
}

export function getRegisteredRoutes() {
	return [...ObjectUtilities.values(routeRegistry)];
}
