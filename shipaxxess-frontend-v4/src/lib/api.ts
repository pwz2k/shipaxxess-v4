import { app } from "@client/config/app";
import { toast } from "sonner";

export class APIManger {
	private path: string | null = null;
	private successToast: string | null = null;
	private errorToast: string | null = null;
	private req: Response | null = null;
	private headers: HeadersInit | null = { "Content-Type": "application/json" };

	/**
	 *
	 */
	private required() {
		if (this.path === null) throw new Error("Path not found");
		if (this.headers === null) throw new Error("Headers not found");
	}

	/**
	 *
	 */
	url(path: string, host?: string) {
		if (host) {
			this.path = `${host}${path}`;
		}

		this.path = app.mode === "dev" ? `${app.api}${path}` : `${app.api}${path}`;

		return this;
	}

	/**
	 *
	 * @returns
	 */
	showErrorToast(header?: string) {
		if (this.errorToast === null) return;

		toast.error(header ? header : "Error Found", {
			description: this.errorToast,
		});
	}

	/**
	 *
	 * @returns
	 */
	showSuccessToast(header?: string) {
		if (this.successToast === null) return;

		toast.success(header ? header : "Success", {
			description: this.successToast,
		});
	}

	/**
	 *
	 * @returns
	 */
	useAuth() {
		const token = localStorage.getItem("token");
		if (token === null) throw new Error("No token found");

		this.headers = { ...this.headers, Authorization: `Bearer ${token}` };

		return this;
	}

	/**
	 *
	 */
	async json<T>() {
		if (this.req === null) throw new Error("Request not defined");

		try {
			const res = (await this.req.json()) as { message: string };

			if (!this.req.ok && res.message) {
				this.errorToast = res.message;
				return res as T;
			}

			this.successToast = res.message;

			return res as T;
		} catch (error) {
			this.errorToast = (error as Error).message;
			throw error;
		}
	}

	/**
	 *
	 */
	async post(body: object) {
		this.required();

		const req = await fetch(this.path!, {
			method: "POST",
			headers: this.headers!,
			body: JSON.stringify(body),
		});

		this.req = req;

		return this;
	}

	/**
	 *
	 */
	async get() {
		this.required();

		const req = await fetch(this.path!, {
			method: "GET",
			headers: this.headers!,
		});

		this.req = req;

		return this;
	}

	/**
	 *
	 */
	async patch(body: object) {
		this.required();

		const req = await fetch(this.path!, {
			method: "PATCH",
			headers: this.headers!,
			body: JSON.stringify(body),
		});

		this.req = req;

		return this;
	}

	/**
	 *
	 */
	async delete(body: object) {
		this.required();

		const req = await fetch(this.path!, {
			method: "DELETE",
			headers: this.headers!,
			body: JSON.stringify(body),
		});

		this.req = req;

		return this;
	}
}

export const api = new APIManger();
