import { t } from "@rbxts/t";
import type { Middleware } from "..";
export const requireRole = (role: string): Middleware => {
	return (ctx) => {
		if (ctx.player.GetAttribute("role") === role) return { continue: true };
		return { continue: false, error: "Forbidden", code: 403 };
	};
};
