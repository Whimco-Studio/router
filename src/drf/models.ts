export class Model<T extends Record<string, unknown>> {
        protected data: T;

        constructor(initial: T) {
                this.data = initial;
        }

        getFields() {
                return this.data;
        }

        save() {
                // placeholder for persistent storage
        }

        delete() {
                // placeholder for deletion logic
        }
}
