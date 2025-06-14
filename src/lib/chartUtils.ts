import type { VisitorData } from "@/types/visitor";
import { format } from "date-fns";

export interface ChartDataPoint {
	time: string;
	male: number;
	female: number;
	total?: number;
	malePrevWeek?: number;
	femalePrevWeek?: number;
	totalPrevWeek?: number;
}

// 固定の営業時間範囲を生成（18:00-2:50）
function generateBusinessHours(): string[] {
	const hours: string[] = [];

	// 18:00-23:59（10分間隔）
	for (let hour = 18; hour <= 23; hour++) {
		for (let minute = 0; minute < 60; minute += 10) {
			hours.push(
				`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
			);
		}
	}

	// 0:00-2:50（10分間隔）
	for (let hour = 0; hour <= 2; hour++) {
		const maxMinute = hour === 2 ? 50 : 59;
		for (let minute = 0; minute <= maxMinute; minute += 10) {
			hours.push(
				`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
			);
		}
	}

	return hours;
}

export function transformVisitorDataToChart(
	visitorData: VisitorData,
): ChartDataPoint[] {
	return visitorData.data.map((point) => ({
		time: new Date(point.timestamp * 1000).toLocaleTimeString("ja-JP", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		}),
		male: point.male,
		female: point.female,
		total: point.total,
	}));
}

export function transformVisitorDataWithComparison(
	currentData: VisitorData,
	prevWeekData?: VisitorData,
): ChartDataPoint[] {
	const businessHours = generateBusinessHours();

	// 現在データをマップに変換
	const currentDataMap = new Map(
		currentData.data.map((point) => [
			new Date(point.timestamp * 1000).toLocaleTimeString("ja-JP", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			point,
		]),
	);

	// 先週データをマップに変換
	const prevWeekMap = new Map(
		prevWeekData?.data.map((point) => [
			new Date(point.timestamp * 1000).toLocaleTimeString("ja-JP", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			point,
		]) || [],
	);

	// 固定の営業時間範囲（18:00-2:50）でデータポイントを生成
	return businessHours.map((time) => {
		const currentPoint = currentDataMap.get(time);
		const prevWeekPoint = prevWeekMap.get(time);

		return {
			time,
			// 現在データ：データがない場合は0
			male: currentPoint?.male || 0,
			female: currentPoint?.female || 0,
			total: currentPoint
				? currentPoint.total || currentPoint.male + currentPoint.female
				: 0,
			// 先週データ：データがない場合は0
			malePrevWeek: prevWeekPoint?.male || 0,
			femalePrevWeek: prevWeekPoint?.female || 0,
			totalPrevWeek: prevWeekPoint
				? prevWeekPoint.total || prevWeekPoint.male + prevWeekPoint.female
				: 0,
		};
	});
}

export function formatDateForAPI(date: Date): string {
	return format(date, "yyyy-MM-dd");
}
