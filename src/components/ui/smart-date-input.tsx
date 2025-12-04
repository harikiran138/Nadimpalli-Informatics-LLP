"use client"

import * as React from "react"
import { format, parse, isValid, isBefore, isAfter } from "date-fns"
import { Calendar as CalendarIcon, CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface SmartDateInputProps {
    value?: Date
    onSelect: (date: Date | undefined) => void
    label?: string
    placeholder?: string
    fromDate?: Date
    toDate?: Date
}

export function SmartDateInput({
    value,
    onSelect,
    label,
    placeholder = "DD/MM/YYYY",
    fromDate,
    toDate,
}: SmartDateInputProps) {
    const [inputValue, setInputValue] = React.useState("")
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

    // Sync input value when prop value changes
    React.useEffect(() => {
        if (value) {
            setInputValue(format(value, "dd/MM/yyyy"))
        } else {
            setInputValue("")
        }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "")

        // Limit to 8 digits (ddmmyyyy)
        if (val.length > 8) val = val.slice(0, 8)

        // Auto-format
        if (val.length >= 5) {
            val = val.slice(0, 2) + "/" + val.slice(2, 4) + "/" + val.slice(4)
        } else if (val.length >= 3) {
            val = val.slice(0, 2) + "/" + val.slice(2)
        }

        setInputValue(val)

        // Try to parse and set date if complete
        if (val.length === 10) {
            const parsedDate = parse(val, "dd/MM/yyyy", new Date())
            if (isValid(parsedDate)) {
                // Check constraints
                if (fromDate && isBefore(parsedDate, fromDate)) return
                if (toDate && isAfter(parsedDate, toDate)) return

                onSelect(parsedDate)
            }
        } else if (val === "") {
            onSelect(undefined)
        }
    }

    const handleDaySelect = (date: Date | undefined) => {
        onSelect(date)
        if (date) {
            setInputValue(format(date, "dd/MM/yyyy"))
            setIsPopoverOpen(false)
        } else {
            setInputValue("")
        }
    }

    const handleTodayClick = () => {
        const today = new Date()
        handleDaySelect(today)
    }

    return (
        <div className="space-y-1">
            {label && <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>}
            <div className="relative group">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={placeholder}
                            className={cn(
                                "h-12 pl-12 pr-10 rounded-xl bg-white/20 border border-white/30 text-slate-800 placeholder:text-slate-400 focus:bg-white/40 focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium backdrop-blur-sm shadow-sm",
                                !inputValue && "text-slate-500"
                            )}
                        />
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <CalendarIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                    </div>
                    <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900 border-none shadow-2xl rounded-xl" align="start">
                        <Calendar
                            mode="single"
                            selected={value}
                            onSelect={handleDaySelect}
                            initialFocus
                            captionLayout="dropdown"
                            fromDate={fromDate}
                            toDate={toDate}
                            classNames={{
                                day_hidden: "invisible",
                                dropdown: "px-2 py-1.5 rounded-md bg-transparent text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer appearance-none border-none outline-none",
                                caption_dropdowns: "flex gap-3",
                                vhidden: "hidden",
                                caption_label: "hidden",
                            }}
                        />
                        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs font-medium text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                                onClick={handleTodayClick}
                            >
                                Today
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <p className="text-[10px] text-slate-400 font-medium ml-1">Format: dd/mm/yyyy</p>
        </div>
    )
}
