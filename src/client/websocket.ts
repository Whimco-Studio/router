import { ReplicatedStorage } from "@rbxts/services";

const WS_EVENT_NAME = "MockWebSocket";
const event = ReplicatedStorage.WaitForChild(WS_EVENT_NAME) as RemoteEvent;

interface WebSocketClient<T = unknown> {
	send: (data: T) => void;
	onMessage: (cb: (data: T) => void) => void;
	unsubscribe: () => void;
}

export function connectWebSocket<T = unknown>(route: string): WebSocketClient<T> {
	let messageCallback: ((data: T) => void) | undefined;

	const connection = event.OnClientEvent.Connect((msg) => {
		const {
			route: msgRoute,
			_type,
			payload,
		} = msg as {
			route: string;
			_type: "subscribe" | "message" | "unsubscribe";
			payload: T;
		};

		if (msgRoute === route && _type === "message") {
			messageCallback?.(payload);
		}
	});

	// Send subscribe on init
	event.FireServer({ route, _type: "subscribe" });

	return {
		send: (data: T) => {
			event.FireServer({ route, _type: "message", payload: data });
		},
		onMessage: (cb) => {
			messageCallback = cb;
		},
		unsubscribe: () => {
			event.FireServer({ route, _type: "unsubscribe" });
			connection.Disconnect();
		},
	};
}
