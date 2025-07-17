import type { InferTType } from "..";

export class Serializer<S extends (val: unknown) => unknown> {
        constructor(public schema: S) {}

        validate(data: unknown): data is InferTType<S> {
                const result = this.schema(data);
                const isValid = typeIs(result, "boolean") ? result : (result as [boolean])[0];
                return isValid as boolean;
        }

        deserialize(data: unknown): InferTType<S> {
                if (!this.validate(data)) {
                        throw `Invalid payload`;
                }
                return data as InferTType<S>;
        }

        serialize(data: InferTType<S>): unknown {
                return data as unknown;
        }
}
