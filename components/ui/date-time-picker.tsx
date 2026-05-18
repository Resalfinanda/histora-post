"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  name: string;
  defaultValue?: Date | null;
}

export function DateTimePicker({ name, defaultValue }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue || undefined,
  );

  const [time, setTime] = React.useState<string>(
    defaultValue ? format(defaultValue, "HH:mm") : "12:00",
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(":");
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
    }
    setDate(selectedDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (date) {
      const [hours, minutes] = newTime.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      setDate(newDate);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={date ? date.toISOString() : ""} />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP 'pukul' HH:mm", { locale: idLocale })
            ) : (
              <span>Pilih tanggal & waktu...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
          <div className="p-3 border-t border-border bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Jam:</span>
              <Input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="w-full"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
