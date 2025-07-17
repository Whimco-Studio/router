import type { Middleware } from "..";

export function requireRole(role: string): Middleware {
	return (ctx) => {
		if (ctx.player.GetAttribute("role") === role) return { continue: true };
		return { continue: false, error: "Forbidden", code: 403 };
	};
}

export function requireAuth(): Middleware {
        return (ctx) => {
                return ctx.player.GetAttribute("IsAuthenticated")
                        ? { continue: true }
                        : { continue: false, error: "Unauthorized", code: 401 };
        };
}

export function requireTokenAuth(token: string): Middleware {
        return (ctx) => {
                return ctx.player.GetAttribute("AuthToken") === token
                        ? { continue: true }
                        : { continue: false, error: "Unauthorized", code: 401 };
        };
}
