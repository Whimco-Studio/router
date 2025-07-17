import type { RouteContext, RegisteredRoute } from "..";
import { registerRoute } from "../core/router";
import type { Serializer } from "./serializer";
import type { InferTType } from "..";
const anySchema = (value: unknown) => true;

export interface ViewSetOptions<S extends (val: unknown) => unknown> {
        prefix: string;
        serializer: Serializer<S>;
        actions: Partial<{
                list: RegisteredRoute<void>["handler"];
                retrieve: RegisteredRoute<{ id: string }>["handler"];
                create: RegisteredRoute<InferTType<S>>["handler"];
                update: RegisteredRoute<InferTType<S>>["handler"];
                destroy: RegisteredRoute<{ id: string }>["handler"];
        }>;
}

export function registerViewSet<S extends (val: unknown) => unknown>(opts: ViewSetOptions<S>) {
        const { prefix, actions, serializer } = opts;
        if (actions.list) {
                registerRoute<typeof anySchema>({
                        name: `${prefix}:list`,
                        schema: anySchema,
                        handler: actions.list as unknown as RegisteredRoute<unknown>["handler"],
                });
        }
        if (actions.retrieve) {
                registerRoute<typeof anySchema>({
                        name: `${prefix}:retrieve`,
                        schema: anySchema,
                        handler: actions.retrieve as unknown as RegisteredRoute<unknown>["handler"],
                });
        }
        if (actions.create) {
                registerRoute({
                        name: `${prefix}:create`,
                        schema: serializer.schema,
                        handler: actions.create,
                });
        }
        if (actions.update) {
                registerRoute({
                        name: `${prefix}:update`,
                        schema: serializer.schema,
                        handler: actions.update,
                });
        }
        if (actions.destroy) {
                registerRoute<typeof anySchema>({
                        name: `${prefix}:destroy`,
                        schema: anySchema,
                        handler: actions.destroy as unknown as RegisteredRoute<unknown>["handler"],
                });
        }
}
