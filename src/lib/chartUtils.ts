import type { VisitorData } from "@/types/visitor";
import { format } from "date-fns";

export interface ChartDataPoint {
	time: string;
	male: number | null;
	female: number | null;
	total?: number | null;
	malePrevWeek?: number | null;
	femalePrevWeek?: number | null;
	totalPrevWeek?: number | null;
}

// 固定の時間範囲（18:00から翌日2:50まで）のテンプレートを生成
function generateTimeTemplate(): string[] {
	const times: string[] = [];

	// 18:00から23:59まで（10分間隔）
	for (let hour = 18; hour <= 23; hour++) {
		for (let minute = 0; minute < 60; minute += 10) {
			times.push(
				`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
			);
		}
	}

	// 0:00から2:50まで（10分間隔）
	for (let hour = 0; hour <= 2; hour++) {
		const maxMinute = hour === 2 ? 50 : 59;
		for (let minute = 0; minute <= maxMinute; minute += 10) {
			times.push(
				`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
			);
		}
	}

	return times;
}

export function transformVisitorDataToChart(
	visitorData: VisitorData,
): ChartDataPoint[] {
	// 固定の時間テンプレートを取得
	const timeTemplate = generateTimeTemplate();

	// データのマップを作成
	const dataMap = new Map(
		visitorData.data.map((point) => {
			const timeString = new Date(point.timestamp * 1000).toLocaleTimeString(
				"ja-JP",
				{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				},
			);
			return [timeString, point];
		}),
	);

	// テンプレートに基づいてチャートデータを生成
	return timeTemplate.map((time) => {
		const dataPoint = dataMap.get(time);

		return {
			time,
			male: dataPoint?.male ?? null,
			female: dataPoint?.female ?? null,
			total: dataPoint?.total ?? null,
		};
	});
}

export function transformVisitorDataWithComparison(
	currentData: VisitorData,
	prevWeekData?: VisitorData,
): ChartDataPoint[] {
	// 固定の時間テンプレートを取得
	const timeTemplate = generateTimeTemplate();

	// 現在データのマップを作成
	const currentDataMap = new Map(
		currentData.data.map((point) => {
			const timeString = new Date(point.timestamp * 1000).toLocaleTimeString(
				"ja-JP",
				{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				},
			);
			return [timeString, point];
		}),
	);

	// 前週データのマップを作成
	const prevWeekDataMap = prevWeekData
		? new Map(
				prevWeekData.data.map((point) => {
					const timeString = new Date(
						point.timestamp * 1000,
					).toLocaleTimeString("ja-JP", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					});
					return [timeString, point];
				}),
			)
		: new Map();

	// テンプレートに基づいてチャートデータを生成
	return timeTemplate.map((time) => {
		const currentPoint = currentDataMap.get(time);
		const prevWeekPoint = prevWeekDataMap.get(time);

		return {
			time,
			male: currentPoint?.male ?? null,
			female: currentPoint?.female ?? null,
			total: currentPoint?.total ?? null,
			malePrevWeek: prevWeekPoint?.male ?? null,
			femalePrevWeek: prevWeekPoint?.female ?? null,
			totalPrevWeek: prevWeekPoint?.total ?? null,
		};
	});
}

export function formatDateForAPI(date: Date): string {
	return format(date, "yyyy-MM-dd");
}
