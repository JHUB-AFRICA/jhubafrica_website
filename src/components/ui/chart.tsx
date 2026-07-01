import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const ChartContext = React.createContext<{
  config: ChartConfig
} | null>(null)

interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode
    theme?: {
      light?: string
      dark?: string
    }
    icon?: React.ComponentType
  }
}

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis_line]:stroke-border/50 [&_.recharts-curve.recharts-type-monotone]:stroke-border [&_.recharts-default-tooltip]:!bg-background [&_.recharts-default-tooltip]:!border-border [&_.recharts-default-tooltip]:!border [&_.recharts-default-tooltip]:!rounded-md [&_.recharts-default-tooltip]:!shadow-md [&_.recharts-tooltip-wrapper]:!outline-none",
          className
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    Pick<RechartsPrimitive.TooltipProps, "active" | "payload" | "label">
>(({ active, payload, label, className, indicator = "dot", ...props }, ref) => {
  const { config } = useChart()

  if (active && payload && payload.length) {
    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {label && (
          <div className="text-muted-foreground">{label}</div>
        )}
        {payload.map((item, index) => {
          const key = `${item.dataKey}`
          const itemConfig = config[key as keyof typeof config]

          return (
            <div
              key={`tooltip-item-${index}`}
              className="flex w-full flex-nowrap items-center gap-2 pt-1.5 last:mb-0 last:pt-0"
            >
              {itemConfig?.theme?.light && (
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-current"
                  style={{
                    color: item.color || "hsl(var(--foreground))",
                  }}
                />
              )}
              <div className="flex flex-1 justify-between gap-8">
                <span className="text-muted-foreground">
                  {itemConfig?.label || key}
                </span>
                <span className="font-mono font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return null
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    Pick<RechartsPrimitive.LegendProps, "payload">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-wrap items-center justify-center gap-4 [&>*]:cursor-pointer",
      className
    )}
    {...props}
  />
))
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartContext,
  useChart,
  type ChartConfig,
}
