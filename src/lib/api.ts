import type { VisitorData, VisitorDataRequest } from "@/types/visitor";

const API_BASE_URL =
	process.env.API_BASE_URL ||
	"https://5ikj3hpnz27cdwpbz2ndrokvyi0aazgl.lambda-url.ap-northeast-1.on.aws";

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public response?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

// Raw API response types (as strings)
interface RawVisitorDataItem {
	timestamp: string;
	male: string;
	female: string;
}

interface RawVisitorData {
	shop: string;
	date: string;
	data: RawVisitorDataItem[];
}

async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	};

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = `HTTP error! status: ${response.status}`;

			try {
				const errorData = JSON.parse(errorText);
				if (response.status === 404 && errorData.message === "Data not found") {
					errorMessage = "選択された日付にはデータが登録されていません";
				} else if (errorData.message) {
					errorMessage = errorData.message;
				}
			} catch {
				// If not JSON, use default message
			}

			throw new ApiError(errorMessage, response.status, errorText);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(
			`ネットワークエラー: ${error instanceof Error ? error.message : "不明なエラーが発生しました"}`,
			0,
		);
	}
}

export const api = {
	getVisitorData: async (request: VisitorDataRequest): Promise<VisitorData> => {
		const rawData = await apiRequest<RawVisitorData>("/", {
			method: "POST",
			body: JSON.stringify(request),
		});

		// Transform the raw data to match our expected types
		return {
			shop: rawData.shop,
			date: rawData.date,
			data: rawData.data.map((item) => ({
				timestamp: Number.parseInt(item.timestamp, 10),
				male: Number.parseInt(item.male, 10),
				female: Number.parseInt(item.female, 10),
				total:
					Number.parseInt(item.male, 10) + Number.parseInt(item.female, 10),
			})),
		};
	},
};
