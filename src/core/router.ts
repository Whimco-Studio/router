import { ObjectUtilities } from "@rbxts/luau-polyfill";

const routeRegistry = new Map<string, RegisteredRoute<unknown>>();
const globalMiddlewares: Middleware[] = [];

export function registerRoute(route: RegisteredRoute<unknown>) {
	if (routeRegistry.has(route.name)) {
		warn(`[rest-core] Route "${route.name}" already registered.`);
	}
	routeRegistry.set(route.name, route);
}

export function registerRoutes(namespace: string, routes: RegisteredRoute<unknown>[]) {
	for (const route of routes) {
		registerRoute({ ...route, name: `${namespace}:${route.name}` });
	}
}

export function use(middleware: Middleware) {
	globalMiddlewares.push(middleware);
}

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
