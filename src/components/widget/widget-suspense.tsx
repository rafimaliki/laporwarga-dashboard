import { Suspense, type ReactNode } from "react";

interface WidgetSkeletonProps {
  height?: string;
  showHeader?: boolean;
  headerTitle?: string;
}

export function WidgetSkeleton({
  height = "h-64",
  showHeader = true,
  headerTitle,
}: WidgetSkeletonProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {showHeader && (
        <div className="mb-6 flex items-center justify-between">
          {headerTitle ? (
            <h3 className="font-semibold text-slate-800">{headerTitle}</h3>
          ) : (
            <div className="h-6 w-32 rounded-lg bg-slate-100 animate-pulse" />
          )}
          <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      )}
      <div
        className={`${height} w-full rounded-xl bg-slate-50 animate-pulse`}
      />
    </section>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-40 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
      </div>
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 py-3 border-b border-slate-50"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 rounded bg-slate-50 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function MapSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-44 rounded-lg bg-slate-100 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-16 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-8 w-16 rounded-lg bg-slate-100 animate-pulse" />
        </div>
      </div>
      <div className="h-80 w-full rounded-xl bg-slate-50 animate-pulse flex items-center justify-center">
        <div className="text-slate-300">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export function ChartSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-36 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 animate-pulse">
            <div className="h-4 w-20 rounded bg-slate-100 mb-2" />
            <div className="h-8 w-16 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      {/* Chart Area */}
      <div className="h-48 w-full rounded-xl bg-slate-50 animate-pulse" />
    </section>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-40 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full rounded-lg bg-slate-50 animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
          </div>
          <div className="h-9 w-20 rounded bg-slate-100 animate-pulse mb-4" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface WidgetSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function WidgetSuspense({ children, fallback }: WidgetSuspenseProps) {
  return (
    <Suspense fallback={fallback ?? <WidgetSkeleton />}>{children}</Suspense>
  );
}
