export const routerLogger: Middleware = (ctx) => {
	print(`[ROUTER] ${ctx.meta?.route} called by ${ctx.player.Name}`);
	return { continue: true };
};

export const routerAuth: Middleware = (ctx) => {
	if (!ctx.player.GetAttribute("IsAuthenticated")) {
		return { continue: false, error: "Unauthorized", code: 401 };
	}
	return { continue: true };
};
