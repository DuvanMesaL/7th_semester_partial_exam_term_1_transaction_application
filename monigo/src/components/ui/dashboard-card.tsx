import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

const cardVariants = cva("transition-all duration-200 hover:shadow-md", {
  variants: {
    variant: {
      default: "bg-card",
      primary: "bg-primary text-primary-foreground",
      success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      danger: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",
      warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface DashboardCardProps extends VariantProps<typeof cardVariants> {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
  className?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function DashboardCard({ title, value, icon, subtitle, variant, className, trend }: DashboardCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className={cn(cardVariants({ variant }), className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={cn("p-2 rounded-full", variant === "primary" ? "bg-primary-foreground/20" : "bg-background")}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <p
              className={cn("text-xs", variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <div
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.isPositive ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {trend.isPositive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {trend.value}%
              </div>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

