"use client";

import * as React from "react";
import { subDays } from "date-fns";
import { getStoresByPrefecture } from "@/lib/stores";
import { useVisitorDataWithComparison } from "@/hooks/useVisitorData";
import { transformVisitorDataWithComparison, formatDateForAPI } from "@/lib/chartUtils";
import { SelectionControls } from "@/components/SelectionControls";
import { ChartSection } from "@/components/ChartSection";

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

  // モバイルブラウザのアドレスバー対応
  React.useEffect(() => {
    function setVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // 都道府県が変更された時に店舗選択をリセット
  React.useEffect(() => {
    setSelectedStore(null);
  }, [selectedPrefecture]);

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
    <div className="mobile-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="h-full flex flex-col">
        {/* ヘッダー */}
        <div className="flex-shrink-0 py-1 text-center">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            相席カウンター
          </h1>
        </div>

        {/* 選択コントロール */}
        <div className="flex-shrink-0 px-2 sm:px-4 pb-1">
          <SelectionControls
            selectedPrefecture={selectedPrefecture}
            onPrefectureChange={setSelectedPrefecture}
            selectedStore={selectedStore}
            onStoreChange={setSelectedStore}
            availableStores={availableStores}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            calendarOpen={calendarOpen}
            onCalendarOpenChange={setCalendarOpen}
          />
        </div>

        {/* チャートセクション */}
        <div className="flex-1 overflow-hidden px-2 sm:px-4 pb-1">
          <ChartSection
            selectedDate={selectedDate}
            selectedStoreInfo={selectedStoreInfo}
            selectedPrefecture={selectedPrefecture}
            isLoading={isLoading}
            isError={isError}
            error={error}
            apiRequest={apiRequest}
            chartData={chartData}
          />
        </div>
      </div>
    </div>
  );
}
