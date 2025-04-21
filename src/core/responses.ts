export function success<T>(data: T) {
	return { success: true, data };
}

export function err(err: string, code = 400) {
	return { success: false, err, code };
}
