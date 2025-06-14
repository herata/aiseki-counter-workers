import { PrefectureSelect } from "@/components/PrefectureSelect";
import { ShopSelect } from "@/components/ShopSelect";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Store } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

interface SelectionControlsProps {
	selectedPrefecture: string | null;
	onPrefectureChange: (value: string | null) => void;
	selectedStore: string | null;
	onStoreChange: (value: string | null) => void;
	availableStores: Store[];
	selectedDate: Date;
	onDateChange: (date: Date) => void;
	calendarOpen: boolean;
	onCalendarOpenChange: (open: boolean) => void;
}

export function SelectionControls({
	selectedPrefecture,
	onPrefectureChange,
	selectedStore,
	onStoreChange,
	availableStores,
	selectedDate,
	onDateChange,
	calendarOpen,
	onCalendarOpenChange,
}: SelectionControlsProps) {
	return (
		<div className="mb-4 sm:mb-6 flex flex-col items-center justify-center gap-2 sm:gap-3">
			{/* 都道府県・店舗選択 */}
			<div className="flex items-center gap-3 w-full max-w-md">
				<div className="flex-1">
					<PrefectureSelect
						value={selectedPrefecture}
						onValueChange={onPrefectureChange}
					/>
				</div>

				<div className="flex-1">
					<ShopSelect
						value={selectedStore}
						onValueChange={onStoreChange}
						stores={availableStores}
						disabled={!selectedPrefecture}
					/>
				</div>
			</div>

			{/* 日付選択 */}
			<Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-full max-w-md sm:w-auto justify-start text-left font-normal h-9 sm:h-10 px-3",
							!selectedDate && "text-muted-foreground",
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
								onDateChange(date);
								onCalendarOpenChange(false);
							}
						}}
						disabled={(date) => date > new Date()}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
