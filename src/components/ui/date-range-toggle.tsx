import { Calendar, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { DateRangeType } from "@/lib/utils";

interface DateRangeToggleProps {
  dateRangeType: DateRangeType;
  onChange: (type: DateRangeType) => void;
}

const DATE_RANGE_OPTIONS: { value: DateRangeType; label: string }[] = [
  { value: "all", label: "Semua Waktu" },
  { value: "year", label: "Tahun Ini" },
  { value: "month", label: "Bulan Ini" },
  { value: "week", label: "Minggu Ini" },
  { value: "day", label: "Hari Ini" },
];

export default function DateRangeToggle({
  dateRangeType,
  onChange,
}: DateRangeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = DATE_RANGE_OPTIONS.find(
    (opt) => opt.value === dateRangeType
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
      >
        <Calendar size={16} />
        {selectedOption?.label}
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                option.value === dateRangeType
                  ? "bg-sky-50 text-sky-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
