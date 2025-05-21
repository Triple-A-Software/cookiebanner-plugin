import type * as T from "../../../../bindings";

export type API = {
	"/api/settings": {
		GET: {
			response: T.Settings;
		};
		POST: {
			body: T.Settings;
			error: T.ApiError;
			response: T.StatusResponse;
		};
	};
};
