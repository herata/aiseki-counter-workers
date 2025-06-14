import { AlertCircle, Store, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full text-center p-6">
      <div className="space-y-3">
        {icon}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}

export function ErrorState({ error }: { error: unknown }) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-red-500 mx-auto" />}
      title="データの取得に失敗しました"
      description={error instanceof Error ? error.message : "不明なエラーが発生しました"}
      action={
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </Button>
      }
    />
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="space-y-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-500" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          データを読み込んでいます...
        </p>
      </div>
    </div>
  );
}

export function SelectionRequiredState() {
  return (
    <EmptyState
      icon={<Store className="h-12 w-12 text-slate-400 mx-auto" />}
      title="店舗と日付を選択してください"
      description="グラフを表示するには都道府県と店舗を選択してください"
    />
  );
}

export function NoDataState() {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12 text-slate-400 mx-auto" />}
      title="データがありません"
      description="選択された日付にはデータが登録されていません"
    />
  );
}
