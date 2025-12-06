import * as React from "react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
    value?: string;
    onChange: (date: string) => void;
    minYear?: number;
    maxYear?: number;
    className?: string;
    error?: boolean;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function DateSelector({
    value,
    onChange,
    minYear = 1900,
    maxYear = new Date().getFullYear(),
    className,
    error
}: DateSelectorProps) {
    // Parse value YYYY-MM-DD
    const [year, month, day] = value ? value.split("-").map(Number) : [null, null, null];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

    const handleChange = (type: "day" | "month" | "year", newVal: number) => {
        let newDate = {
            day: type === "day" ? newVal : (day || 1),
            month: type === "month" ? newVal : (month || 1),
            year: type === "year" ? newVal : (year || maxYear)
        };

        // Validate max days in month
        const maxDays = new Date(newDate.year, newDate.month, 0).getDate();
        if (newDate.day > maxDays) {
            newDate.day = maxDays;
        }

        // Format to YYYY-MM-DD
        const formattedDate = `${newDate.year}-${String(newDate.month).padStart(2, "0")}-${String(newDate.day).padStart(2, "0")}`;
        onChange(formattedDate);
    };

    const selectClass = cn(
        "h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-slate-800 focus:outline-none focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 appearance-none font-medium font-sans transition-all backdrop-blur-sm shadow-sm cursor-pointer",
        error && "border-red-500 focus:border-red-500 ring-red-500/20"
    );

    return (
        <div className={cn("grid grid-cols-3 gap-3", className)}>
            {/* Day */}
            <div className="relative">
                <select
                    value={day || ""}
                    onChange={(e) => handleChange("day", parseInt(e.target.value))}
                    className={cn(selectClass, "w-full")}
                >
                    <option value="" disabled className="text-slate-500">Day</option>
                    {days.map((d) => (
                        <option key={d} value={d} className="text-slate-800">
                            {d}
                        </option>
                    ))}
                </select>
            </div>

            {/* Month */}
            <div className="relative">
                <select
                    value={month || ""}
                    onChange={(e) => handleChange("month", parseInt(e.target.value))}
                    className={cn(selectClass, "w-full")}
                >
                    <option value="" disabled className="text-slate-500">Month</option>
                    {months.map((m, i) => (
                        <option key={m} value={i + 1} className="text-slate-800">
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year */}
            <div className="relative">
                <select
                    value={year || ""}
                    onChange={(e) => handleChange("year", parseInt(e.target.value))}
                    className={cn(selectClass, "w-full")}
                >
                    <option value="" disabled className="text-slate-500">Year</option>
                    {years.map((y) => (
                        <option key={y} value={y} className="text-slate-800">
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
