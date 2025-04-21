import { t } from "@rbxts/t";
import { defineRoute, handleRoute, registerRoute, registerRoutes } from "../core/router";

const ExampleSchema = t.interface({
	name: t.string,
	age: t.number,
});

registerRoute(
	defineRoute(ExampleSchema, {
		name: "example_1",
		handler: ({ payload }) => {
			print(payload.name);
		},
	}),
);

registerRoutes("example_2", [
	defineRoute(ExampleSchema, {
		name: "check age",
		handler: ({ payload }) => {
			print(payload.age);
		},
	}),
	defineRoute(ExampleSchema, {
		name: "create",
		handler: ({ payload }) => {
			print(payload); // { age: 10, name: "test" }
		},
	}),
]);

handleRoute("example_2:create", game.GetService("Players").LocalPlayer, {
	age: 10,
	name: "test",
});
