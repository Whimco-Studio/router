import { deepCopy } from "@rbxts/deepcopy";

export function deepClone<T>(obj: T): T {
	return deepCopy(obj as unknown as object) as T;
}
