// src/runtime/routerBridge.ts

// src/runtime/routerBridge.ts
import { ReplicatedStorage } from "@rbxts/services";
import { handleRoute } from "../core/router";
import type { RegisteredRoutesMap } from "..";

export function createRouterServer(Routes: RegisteredRoutesMap) {
	const remote = new Instance("RemoteFunction");
	remote.Name = "Router";
	remote.Parent = ReplicatedStorage;

	const flag = new Instance("StringValue");
	flag.Name = "RouterFlag";
	flag.Value = "true";
	flag.Parent = ReplicatedStorage;

	remote.OnServerInvoke = ((player: Player, ...args: unknown[]) => {
		const [routeName, payload] = args;
		if (typeOf(routeName) !== "string") {
			return { success: false, error: "Invalid route name" };
		}
		return handleRoute(routeName as string, player, payload);
	}) as (player: Player, ...args: unknown[]) => unknown;
}

// Client-side: returns strongly-typed route call proxy
export function getRouterClient<R extends RegisteredRoutesMap>(Routes: R) {
	ReplicatedStorage.WaitForChild("RouterFlag");
	const client = ReplicatedStorage.WaitForChild("Router") as RemoteFunction;
	return client;
}
