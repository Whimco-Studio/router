import type { Middleware } from "..";

export function requireRole(role: string): Middleware {
	return (ctx) => {
		const playerRole = ctx.player.GetAttribute("role");
		return playerRole === role ? { continue: true } : { continue: false, error: "Forbidden", code: 403 };
	};
}
