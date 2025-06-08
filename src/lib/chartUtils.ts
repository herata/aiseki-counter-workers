import { format } from "date-fns";
import type { VisitorData } from "@/types/visitor";

export interface ChartDataPoint {
  time: string;
  male: number;
  female: number;
  total?: number;
  malePrevWeek?: number;
  femalePrevWeek?: number;
  totalPrevWeek?: number;
}

export function transformVisitorDataToChart(visitorData: VisitorData): ChartDataPoint[] {
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
  prevWeekData?: VisitorData
): ChartDataPoint[] {
  const currentPoints = currentData.data.map((point) => ({
    time: new Date(point.timestamp * 1000).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    male: point.male,
    female: point.female,
    total: point.total,
  }));

  if (!prevWeekData) {
    return currentPoints;
  }

  // 時間でマッピングして前週データを結合
  const prevWeekMap = new Map(
    prevWeekData.data.map((point) => [
      new Date(point.timestamp * 1000).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      point,
    ])
  );

  return currentPoints.map((point) => {
    const prevWeekPoint = prevWeekMap.get(point.time);
    return {
      ...point,
      malePrevWeek: prevWeekPoint?.male,
      femalePrevWeek: prevWeekPoint?.female,
      totalPrevWeek: prevWeekPoint?.total,
    };
  });
}

export function formatDateForAPI(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
