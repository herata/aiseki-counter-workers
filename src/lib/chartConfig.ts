export const chartConfig = {
  male: {
    label: "男性",
    color: "#2563eb", // 青色
  },
  female: {
    label: "女性", 
    color: "#dc2626", // 赤色
  },
  malePrevWeek: {
    label: "男性（前週）",
    color: "#60a5fa", // 薄い青色（blue-400）
  },
  femalePrevWeek: {
    label: "女性（前週）",
    color: "#f87171", // 薄い赤色
  },
} satisfies import("@/components/ui/chart").ChartConfig;
