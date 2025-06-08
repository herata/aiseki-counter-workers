"use client";

import * as React from "react";
import { format, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Store, Users, Loader2, AlertCircle } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { PrefectureSelect } from "@/components/PrefectureSelect";
import { ShopSelect } from "@/components/ShopSelect";
import { getStoresByPrefecture } from "@/lib/stores";
import { useVisitorDataWithComparison } from "@/hooks/useVisitorData";
import { transformVisitorDataWithComparison, formatDateForAPI } from "@/lib/chartUtils";

const chartConfig = {
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
    color: "#2563eb", // 青色
  },
  femalePrevWeek: {
    label: "女性（前週）",
    color: "#dc2626", // 赤色
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export default function Home() {
  // デフォルト日付の計算（18時前は昨日、18時以降は今日）
  const getDefaultDate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour < 18 ? subDays(now, 1) : now;
  };

  const [selectedPrefecture, setSelectedPrefecture] = React.useState<string | null>(null);
  const [selectedStore, setSelectedStore] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(getDefaultDate());
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  // 都道府県が変更された時に店舗選択をリセット
  React.useEffect(() => {
    setSelectedStore(null);
  }, []);

  // 選択された都道府県の店舗一覧を取得
  const availableStores = React.useMemo(() => {
    return selectedPrefecture ? getStoresByPrefecture(selectedPrefecture) : [];
  }, [selectedPrefecture]);

  // 選択された店舗の情報を取得
  const selectedStoreInfo = React.useMemo(() => {
    return availableStores.find(store => store.id === selectedStore);
  }, [availableStores, selectedStore]);

  // API データリクエスト準備
  const apiRequest = React.useMemo(() => {
    if (!selectedStore || !selectedDate) return null;
    return {
      shop: selectedStore,
      date: formatDateForAPI(selectedDate),
    };
  }, [selectedStore, selectedDate]);

  // API データ取得
  const { data: visitorData, prevWeekData, isLoading, error, isError } = useVisitorDataWithComparison(apiRequest);

  // チャートデータの変換
  const chartData = React.useMemo(() => {
    if (!visitorData) return [];
    return transformVisitorDataWithComparison(visitorData, prevWeekData);
  }, [visitorData, prevWeekData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            相席カウンター
          </h1>
        </div>

        {/* 選択コントロール */}
        <div className="mb-6 sm:mb-8 flex flex-col items-center justify-center gap-3">
          {/* 都道府県・店舗選択 */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1">
              <PrefectureSelect 
                value={selectedPrefecture}
                onValueChange={setSelectedPrefecture}
              />
            </div>
            
            <div className="flex-1">
              <ShopSelect
                value={selectedStore}
                onValueChange={setSelectedStore}
                stores={availableStores}
                disabled={!selectedPrefecture}
              />
            </div>
          </div>
          
          {/* 日付選択 */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full max-w-md sm:w-auto justify-start text-left font-normal h-9 sm:h-10 px-3",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">
                  {format(selectedDate, "yyyy/MM/dd", { locale: ja })}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
                disabled={(date) => date > new Date()}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* グラフ */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-center gap-2 text-center">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {selectedStoreInfo 
                ? `${selectedStoreInfo.name} ${selectedStoreInfo.location}店`
                : selectedPrefecture 
                  ? "店舗を選択してください"
                  : "都道府県を選択してください"
              }
            </CardTitle>
            <CardDescription className="text-center">
              {format(selectedDate, "yyyy年MM月dd日", { locale: ja })}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
            {/* エラー状態 */}
            {isError && (
              <div className="flex items-center justify-center h-[300px] text-center p-6">
                <div className="space-y-3">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      データの取得に失敗しました
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {error instanceof Error ? error.message : "不明なエラーが発生しました"}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    再読み込み
                  </Button>
                </div>
              </div>
            )}

            {/* ローディング状態 */}
            {isLoading && !isError && (
              <div className="flex items-center justify-center h-[300px]">
                <div className="space-y-3 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    データを読み込んでいます...
                  </p>
                </div>
              </div>
            )}

            {/* データ未選択状態 */}
            {!apiRequest && !isLoading && !isError && (
              <div className="flex items-center justify-center h-[300px]">
                <div className="space-y-3 text-center">
                  <Store className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      店舗と日付を選択してください
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      グラフを表示するには都道府県と店舗を選択してください
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* データが空の場合 */}
            {chartData.length === 0 && !isLoading && !isError && apiRequest && (
              <div className="flex items-center justify-center h-[300px]">
                <div className="space-y-3 text-center">
                  <Users className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      データがありません
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      選択された日付にはデータが登録されていません
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* チャート表示 */}
            {chartData.length > 0 && !isLoading && !isError && (
              <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] p-4">
                <ChartContainer config={chartConfig} className="w-full h-full !aspect-auto">
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: -16,
                      right: 16,
                      top: 16,
                      bottom: -16,
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
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
      </div>
    </div>
  );
}
