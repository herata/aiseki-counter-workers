"use client";

import * as React from "react";
import { subDays, format, parse } from "date-fns";
import { useCopilotAction } from "@copilotkit/react-core";
import { getStoresByPrefecture, prefectures, stores } from "@/lib/stores";
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

  // CopilotKit Actions for natural language interface
  useCopilotAction({
    name: "selectPrefecture",
    description: `都道府県を選択します。利用可能な都道府県: ${prefectures.join(", ")}`,
    parameters: [
      {
        name: "prefecture",
        type: "string",
        description: "選択する都道府県名（例: 東京, 大阪, 愛知など）",
        required: true,
      }
    ],
    handler: async ({ prefecture }) => {
      // 都道府県名の正規化（部分一致で検索）
      const normalizedPrefecture = prefectures.find(p => 
        p.includes(prefecture) || prefecture.includes(p)
      );
      
      if (normalizedPrefecture) {
        setSelectedPrefecture(normalizedPrefecture);
        setSelectedStore(null); // 都道府県変更時は店舗選択をリセット
        return `${normalizedPrefecture}を選択しました。`;
      }
      
      return `${prefecture}という都道府県が見つかりませんでした。利用可能な都道府県: ${prefectures.join(", ")}`;
    },
  });

  useCopilotAction({
    name: "selectStore",
    description: "店舗を選択します。まず都道府県を選択してから店舗を選択してください。",
    parameters: [
      {
        name: "storeName",
        type: "string", 
        description: "店舗名または地域名（例: 新宿, 渋谷, 梅田, 札幌など）",
        required: true,
      }
    ],
    handler: async ({ storeName }) => {
      if (!selectedPrefecture) {
        return "まず都道府県を選択してください。例: 「東京を選択して」";
      }

      const availableStores = getStoresByPrefecture(selectedPrefecture);
      
      // 店舗名での部分一致検索（location または name で検索）
      const matchedStore = availableStores.find(store => 
        store.location.includes(storeName) || 
        storeName.includes(store.location) ||
        store.name.includes(storeName) ||
        storeName.includes(store.name)
      );

      if (matchedStore) {
        setSelectedStore(matchedStore.id);
        return `${selectedPrefecture}の${matchedStore.location}${matchedStore.name}店を選択しました。`;
      } else {
        const storeList = availableStores.map(s => `${s.location}${s.name}店`).join(", ");
        return `${selectedPrefecture}に「${storeName}」という店舗が見つかりませんでした。利用可能な店舗: ${storeList}`;
      }
    },
  });

  useCopilotAction({
    name: "selectDate",
    description: "日付を選択します。今日、昨日、または具体的な日付を指定できます。",
    parameters: [
      {
        name: "dateInput",
        type: "string",
        description: "日付の指定（例: 今日, 昨日, 2024-01-15, 1月15日など）",
        required: true,
      }
    ],
    handler: async ({ dateInput }) => {
      const now = new Date();
      let targetDate: Date;

      // 日本語での日付指定
      if (dateInput.includes("今日") || dateInput.includes("きょう")) {
        targetDate = now;
      } else if (dateInput.includes("昨日") || dateInput.includes("きのう")) {
        targetDate = subDays(now, 1);
      } else if (dateInput.includes("一昨日") || dateInput.includes("おととい")) {
        targetDate = subDays(now, 2);
      } else {
        // 具体的な日付の解析を試行
        try {
          // YYYY-MM-DD形式
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
            targetDate = parse(dateInput, "yyyy-MM-dd", new Date());
          }
          // MM/DD形式（今年）
          else if (/^\d{1,2}\/\d{1,2}$/.test(dateInput)) {
            const [month, day] = dateInput.split("/");
            targetDate = new Date(now.getFullYear(), Number.parseInt(month) - 1, Number.parseInt(day));
          }
          // M月D日形式
          else if (/^\d{1,2}月\d{1,2}日$/.test(dateInput)) {
            const match = dateInput.match(/^(\d{1,2})月(\d{1,2})日$/);
            if (match) {
              targetDate = new Date(now.getFullYear(), Number.parseInt(match[1]) - 1, Number.parseInt(match[2]));
            } else {
              throw new Error("日付の解析に失敗しました");
            }
          } else {
            throw new Error("サポートされていない日付形式です");
          }
        } catch (error) {
          return `日付「${dateInput}」を解析できませんでした。サポート形式: 今日, 昨日, YYYY-MM-DD, MM/DD, M月D日`;
        }
      }

      // 未来の日付をチェック
      if (targetDate > now) {
        return "未来の日付は選択できません。過去または今日の日付を選択してください。";
      }

      setSelectedDate(targetDate);
      return `${format(targetDate, "yyyy年MM月dd日")}を選択しました。`;
    },
  });

  useCopilotAction({
    name: "showCurrentSelection",
    description: "現在の選択状況を表示します",
    parameters: [],
    handler: async () => {
      const prefText = selectedPrefecture || "未選択";
      const storeText = selectedStore ? 
        (() => {
          if (!selectedPrefecture) return "不明な店舗";
          const availableStores = getStoresByPrefecture(selectedPrefecture);
          const store = availableStores.find(s => s.id === selectedStore);
          return store ? `${store.location}${store.name}店` : "不明な店舗";
        })() : "未選択";
      const dateText = format(selectedDate, "yyyy年MM月dd日");

      return `現在の選択状況:
- 都道府県: ${prefText}
- 店舗: ${storeText}  
- 日付: ${dateText}`;
    },
  });

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="flex-shrink-0 py-1 text-center m-2">
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
