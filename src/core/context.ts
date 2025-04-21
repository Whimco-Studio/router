export type RouteContext<T = unknown> = {
	player: Player;
	payload: T;
	meta?: {
		route: string;
		timestamp: number;
		[key: string]: unknown;
	};
};
