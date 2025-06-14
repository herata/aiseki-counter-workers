import {
	ErrorState,
	LoadingState,
	NoDataState,
	SelectionRequiredState,
} from "@/components/EmptyStates";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { chartConfig } from "@/lib/chartConfig";
import type { Store } from "@/lib/stores";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface ChartSectionProps {
	selectedDate: Date;
	selectedStoreInfo: Store | undefined;
	selectedPrefecture: string | null;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	apiRequest: { shop: string; date: string } | null;
	chartData: Array<{
		time: string;
		male: number;
		female: number;
		malePrevWeek?: number;
		femalePrevWeek?: number;
	}>;
}

export function ChartSection({
	selectedDate,
	selectedStoreInfo,
	selectedPrefecture,
	isLoading,
	isError,
	error,
	apiRequest,
	chartData,
}: ChartSectionProps) {
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="flex-shrink-0 pb-2 sm:pb-3">
				<CardTitle className="flex items-center justify-center gap-2 text-center text-sm sm:text-base">
					{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
					{selectedStoreInfo
						? `${selectedStoreInfo.name} ${selectedStoreInfo.location}店`
						: selectedPrefecture
							? "店舗を選択してください"
							: "都道府県を選択してください"}
				</CardTitle>
				<CardDescription className="text-center text-xs sm:text-sm">
					{format(selectedDate, "yyyy年MM月dd日", { locale: ja })}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 overflow-hidden p-0">
				{/* エラー状態 */}
				{isError && <ErrorState error={error} />}

				{/* ローディング状態 */}
				{isLoading && !isError && <LoadingState />}

				{/* データ未選択状態 */}
				{!apiRequest && !isLoading && !isError && <SelectionRequiredState />}

				{/* データが空の場合 */}
				{chartData.length === 0 && !isLoading && !isError && apiRequest && (
					<NoDataState />
				)}

				{/* チャート表示 */}
				{chartData.length > 0 && !isLoading && !isError && (
					<div className="w-full h-full p-1 sm:p-2">
						<ChartContainer
							config={chartConfig}
							className="w-full h-full !aspect-auto"
						>
							<LineChart
								accessibilityLayer
								data={chartData}
								margin={{
									left: -8,
									right: 24,
									top: 8,
									bottom: 8,
								}}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="time"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									angle={-45}
									textAnchor="end"
									height={60}
									fontSize={12}
									interval={3} // 15分間隔で4つごと（1時間おき）に表示
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									fontSize={12}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									dataKey="male"
									type="monotone"
									stroke="var(--color-male)"
									strokeWidth={2}
									dot={false}
									activeDot={{
										r: 4,
										fill: "var(--color-male)",
									}}
								/>
								<Line
									dataKey="female"
									type="monotone"
									stroke="var(--color-female)"
									strokeWidth={2}
									dot={false}
									activeDot={{
										r: 4,
										fill: "var(--color-female)",
									}}
								/>
								<Line
									dataKey="malePrevWeek"
									type="monotone"
									stroke="var(--color-malePrevWeek)"
									strokeWidth={2}
									strokeDasharray="5 5"
									dot={false}
									activeDot={{
										r: 4,
										fill: "var(--color-malePrevWeek)",
									}}
								/>
								<Line
									dataKey="femalePrevWeek"
									type="monotone"
									stroke="var(--color-femalePrevWeek)"
									strokeWidth={2}
									strokeDasharray="5 5"
									dot={false}
									activeDot={{
										r: 4,
										fill: "var(--color-femalePrevWeek)",
									}}
								/>
							</LineChart>
						</ChartContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
