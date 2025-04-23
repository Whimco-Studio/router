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
		if (msg.route === route && msg.type === "message") {
			messageCallback?.(msg.payload);
		}
	});

	// Send subscribe on init
	event.FireServer({ route, type: "subscribe" });

	return {
		send: (data: T) => {
			event.FireServer({ route, type: "message", payload: data });
		},
		onMessage: (cb) => {
			messageCallback = cb;
		},
		unsubscribe: () => {
			event.FireServer({ route, type: "unsubscribe" });
			connection.Disconnect();
		},
	};
}
