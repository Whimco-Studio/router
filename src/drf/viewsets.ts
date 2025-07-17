import type { RouteContext, RegisteredRoute } from "..";
import { registerRoute } from "../core/router";
import type { Serializer } from "./serializer";
import type { InferTType } from "..";

const anySchema = (value: unknown) => true;

export abstract class ViewSet<S extends (val: unknown) => unknown> {
       abstract prefix: string;
       abstract serializer: Serializer<S>;

       list?: (ctx: RouteContext<void>) => unknown;
       retrieve?: (ctx: RouteContext<{ id: string }>) => unknown;
       create?: (ctx: RouteContext<InferTType<S>>) => unknown;
       update?: (ctx: RouteContext<InferTType<S>>) => unknown;
       destroy?: (ctx: RouteContext<{ id: string }>) => unknown;
}

export function registerViewSet<S extends (val: unknown) => unknown>(viewset: ViewSet<S>) {
       const { prefix, serializer } = viewset;

       if (viewset.list) {
               registerRoute<typeof anySchema>({
                       name: `${prefix}:list`,
                       schema: anySchema,
                       handler: viewset.list as unknown as RegisteredRoute<unknown>["handler"],
               });
       }

       if (viewset.retrieve) {
               registerRoute<typeof anySchema>({
                       name: `${prefix}:retrieve`,
                       schema: anySchema,
                       handler: viewset.retrieve as unknown as RegisteredRoute<unknown>["handler"],
               });
       }

       if (viewset.create) {
               registerRoute({
                       name: `${prefix}:create`,
                       schema: serializer.schema,
                       handler: viewset.create,
               });
       }

       if (viewset.update) {
               registerRoute({
                       name: `${prefix}:update`,
                       schema: serializer.schema,
                       handler: viewset.update,
               });
       }

       if (viewset.destroy) {
               registerRoute<typeof anySchema>({
                       name: `${prefix}:destroy`,
                       schema: anySchema,
                       handler: viewset.destroy as unknown as RegisteredRoute<unknown>["handler"],
               });
       }


}
