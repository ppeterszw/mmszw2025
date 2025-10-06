import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  minAge?: number; // Minimum age in years (e.g., 18)
  maxAge?: number; // Maximum age in years (e.g., 100)
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  disabled = false,
  minAge = 18,
  maxAge = 100,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(
    value || new Date(new Date().getFullYear() - minAge, 0, 1)
  );

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - minAge; // Maximum year (18 years ago)
  const minYear = currentYear - maxAge; // Minimum year (100 years ago)

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const maxDate = new Date(maxYear, 11, 31); // December 31 of max year
  const minDate = new Date(minYear, 0, 1); // January 1 of min year

  const handleYearChange = (year: string) => {
    const newDate = new Date(month);
    newDate.setFullYear(parseInt(year));
    setMonth(newDate);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(month);
    newDate.setMonth(parseInt(monthIndex));
    setMonth(newDate);
  };

  return (
    <div className="relative w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "peer h-14 w-full rounded-lg border-2 border-gray-200 bg-white px-4 pt-6 pb-2 text-left text-base text-gray-900 transition-all duration-200",
                "focus:border-egyptian-blue focus:ring-2 focus:ring-egyptian-blue/20 focus:outline-none",
                "hover:border-gray-300",
                "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                !value && "text-gray-400"
              )}
            >
              <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {value ? format(value, "PPP") : <span className="text-gray-400">{placeholder}</span>}
            </button>
            <label
              className={cn(
                "absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none",
                value
                  ? "top-1.5 text-xs font-medium text-egyptian-blue"
                  : "top-4 text-base text-gray-400"
              )}
            >
              {label}
            </label>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white shadow-xl border-2 border-gray-100" align="start">
          <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-egyptian-blue/5 to-powder-blue/5">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={month.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-10 border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={month.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-10 border-gray-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthName, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setIsOpen(false);
            }}
            month={month}
            onMonthChange={setMonth}
            disabled={(date) =>
              date > maxDate || date < minDate
            }
            initialFocus
            className="rounded-md"
            classNames={{
              months: "space-y-0",
              month: "space-y-3 p-3",
              caption: "hidden",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-md"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-gray-100",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 transition-colors",
                "aria-selected:bg-gradient-to-r aria-selected:from-egyptian-blue aria-selected:to-powder-blue aria-selected:text-white aria-selected:hover:opacity-90"
              ),
              day_selected: cn(
                "bg-gradient-to-r from-egyptian-blue to-powder-blue text-white hover:opacity-90 focus:opacity-90"
              ),
              day_today: "bg-gray-100 text-gray-900 font-semibold",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
              day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
