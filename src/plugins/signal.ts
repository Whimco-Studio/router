type SignalCallback = (payload: unknown) => void;
const signalMap = new Map<string, SignalCallback[]>();

export function connectSignal(name: string, cb: SignalCallback) {
	signalMap.set(name, [...(signalMap.get(name) ?? []), cb]);
}

export function fireSignal(name: string, payload: unknown) {
	const cbs = signalMap.get(name);
	if (!cbs) return;
	for (const cb of cbs) cb(payload);
}
