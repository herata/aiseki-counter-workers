import { api } from "@/lib/api";
import type { VisitorDataRequest } from "@/types/visitor";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

export function useVisitorData(
	request: VisitorDataRequest | null,
	options?: {
		enabled?: boolean;
		staleTime?: number;
		cacheTime?: number;
	},
) {
	return useQuery({
		queryKey: ["visitorData", request?.shop, request?.date],
		queryFn: () => {
			if (!request) {
				throw new Error("Request is required");
			}
			return api.getVisitorData(request);
		},
		enabled: Boolean(
			request?.shop && request.date && options?.enabled !== false,
		),
		staleTime: options?.staleTime ?? 5 * 60 * 1000,
		gcTime: options?.cacheTime ?? 10 * 60 * 1000,
		retry: (failureCount, error) => {
			// Don't retry on client errors (4xx)
			if (
				"status" in error &&
				typeof error.status === "number" &&
				error.status >= 400 &&
				error.status < 500
			) {
				return false;
			}
			// Retry up to 3 times for other errors
			return failureCount < 3;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
}

export function useVisitorDataWithComparison(
	request: VisitorDataRequest | null,
	options?: {
		enabled?: boolean;
		staleTime?: number;
		cacheTime?: number;
	},
) {
	// 現在の日付のデータ
	const currentDataQuery = useQuery({
		queryKey: ["visitorData", request?.shop, request?.date],
		queryFn: () => {
			if (!request) {
				throw new Error("Request is required");
			}
			return api.getVisitorData(request);
		},
		enabled: Boolean(
			request?.shop && request.date && options?.enabled !== false,
		),
		staleTime: options?.staleTime ?? 5 * 60 * 1000,
		gcTime: options?.cacheTime ?? 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (
				"status" in error &&
				typeof error.status === "number" &&
				error.status >= 400 &&
				error.status < 500
			) {
				return false;
			}
			return failureCount < 3;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	// 一週間前のデータ
	const prevWeekRequest = request
		? {
				shop: request.shop,
				date: format(subDays(new Date(request.date), 7), "yyyy-MM-dd"),
			}
		: null;

	const prevWeekDataQuery = useQuery({
		queryKey: ["visitorData", prevWeekRequest?.shop, prevWeekRequest?.date],
		queryFn: () => {
			if (!prevWeekRequest) {
				throw new Error("Request is required");
			}
			return api.getVisitorData(prevWeekRequest);
		},
		enabled: Boolean(
			prevWeekRequest?.shop &&
				prevWeekRequest.date &&
				options?.enabled !== false,
		),
		staleTime: options?.staleTime ?? 5 * 60 * 1000,
		gcTime: options?.cacheTime ?? 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (
				"status" in error &&
				typeof error.status === "number" &&
				error.status >= 400 &&
				error.status < 500
			) {
				return false;
			}
			return failureCount < 3;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	return {
		data: currentDataQuery.data,
		prevWeekData: prevWeekDataQuery.data,
		isLoading: currentDataQuery.isLoading || prevWeekDataQuery.isLoading,
		error: currentDataQuery.error || prevWeekDataQuery.error,
		isError: currentDataQuery.isError || prevWeekDataQuery.isError,
		currentDataQuery,
		prevWeekDataQuery,
	};
}
