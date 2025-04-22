// src/runtime/routerBridge.ts

import { ObjectUtilities } from "@rbxts/luau-polyfill";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { handleRoute } from "../core/router";
import type { RegisteredRoutesMap } from "..";
import type { t } from "@rbxts/t";

// Server-side: creates RemoteFunctions and binds handlers
export function createRouterServer(Routes: RegisteredRoutesMap) {
	for (const routeName of ObjectUtilities.keys(Routes)) {
		const remote = new Instance("RemoteFunction");
		remote.Name = routeName.split(":").join("_");
		remote.Parent = ReplicatedStorage;

		remote.OnServerInvoke = (player, payload) => {
			return handleRoute(routeName, player, payload);
		};
	}

	const flag = new Instance("StringValue");
	flag.Name = "RouterFlag";
	flag.Value = "true";
	flag.Parent = ReplicatedStorage;
}

// Client-side: returns strongly-typed route call proxy
export function createRouterClient<R extends RegisteredRoutesMap>(Routes: R) {
	const flag = ReplicatedStorage.WaitForChild("RouterFlag");

	const client = {} as {
		[Name in keyof R]: (payload: t.static<R[Name]["schema"]>) => unknown;
	};

	for (const key of ObjectUtilities.keys(Routes) as (keyof R)[]) {
		const remote = ReplicatedStorage.WaitForChild(tostring(key).split(":").join("_")) as RemoteFunction;

		client[key] = (payload) => remote.InvokeServer(payload);
	}

	return client;
}
