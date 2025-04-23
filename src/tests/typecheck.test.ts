import { t } from "@rbxts/t";
import { defineRoute, handleRoute, registerRoute, registerRoutes } from "../core/router";

const ExampleSchema = t.interface({
	name: t.string,
	age: t.number,
});

const getQuirkymalRoute = defineRoute(ExampleSchema, {
	name: "get-quirkymal",
	handler: ({ payload }) => {
		print(payload.name);
	},
	middleware: [(ctx) => ({ continue: true })], // <-- this is causing the error
});

registerRoute(getQuirkymalRoute);

registerRoutes("example", [getQuirkymalRoute]);
registerRoutes("example", [
	getQuirkymalRoute,
	defineRoute(ExampleSchema, {
		name: "create",
		handler: ({ payload }) => {
			print(payload.name);
		},
	}),
]);

handleRoute("example_2:create", game.GetService("Players").LocalPlayer, {
	age: 10,
	name: "test",
});
