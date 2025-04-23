// src/core/websocket.ts
import { ReplicatedStorage } from "@rbxts/services";

export interface WebSocketContext<T = unknown> {
	player: Player;
	send: (data: T) => void;
	onMessage: (cb: (data: T) => void) => void;
	onClose: (cb: () => void) => void;
}

const WS_EVENT_NAME = "MockWebSocket";
const event = new Instance("RemoteEvent");
event.Name = WS_EVENT_NAME;
event.Parent = ReplicatedStorage;

// Storage for all routes
const routeHandlers = new Map<
	string,
	{
		sessions: Map<Player, WebSocketContext>;
		onMessageMap: WeakMap<WebSocketContext, (data: unknown) => void>;
		onCloseMap: WeakMap<WebSocketContext, () => void>;
		handler: (ctx: WebSocketContext) => void;
	}
>();

let connected = false;
function ensureConnection() {
	if (connected) return;
	connected = true;

	event.OnServerEvent.Connect((player, msg) => {
		const { route, type, payload } = msg as {
			route: string;
			type: "subscribe" | "message" | "unsubscribe";
			payload: unknown;
		};

		const info = routeHandlers.get(route);
		if (!info) return;

		const { sessions, onMessageMap, onCloseMap, handler } = info;

		if (type === "subscribe") {
			const ctx: WebSocketContext = {
				player,
				send: (data) => event.FireClient(player, { route, type: "message", payload: data }),
				onMessage: (cb) => onMessageMap.set(ctx, cb),
				onClose: (cb) => onCloseMap.set(ctx, cb),
			};

			sessions.set(player, ctx);
			handler(ctx);
		}

		if (type === "message") {
			const ctx = sessions.get(player);
			const cb = ctx && onMessageMap.get(ctx);
			if (cb) cb(payload);
		}

		if (type === "unsubscribe") {
			const ctx = sessions.get(player);
			const closeCb = ctx && onCloseMap.get(ctx);
			if (closeCb) closeCb();
			sessions.delete(player);
		}
	});
}

export function createMockWebSocket<T>(route: string, handler: (ctx: WebSocketContext<T>) => void) {
	ensureConnection();

	routeHandlers.set(route, {
		sessions: new Map(),
		onMessageMap: new WeakMap(),
		onCloseMap: new WeakMap(),
		handler: handler as (ctx: WebSocketContext) => void,
	});
}
