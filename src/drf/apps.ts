import type { RegisteredRoute } from "..";
import { registerRoutes } from "../core/router";

export class App {
        private routes: RegisteredRoute<unknown>[] = [];

        addRoute(route: RegisteredRoute<unknown>) {
                this.routes.push(route);
        }

        include(namespace: string) {
                registerRoutes(namespace, this.routes as never[]);
        }
}
