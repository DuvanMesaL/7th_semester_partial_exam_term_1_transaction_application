import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Account } from "@/types/account"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, DollarSign, Calendar, User } from "lucide-react"
import { motion } from "framer-motion"

interface AccountSummaryProps {
  account: Account
}

export function AccountSummary({ account }: AccountSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
        <CardDescription>Your banking account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center text-muted-foreground mb-1">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="text-sm">Account Number</span>
            </div>
            <p className="text-xl font-bold">{account.number}</p>
          </div>

          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="text-sm">Current Balance</span>
            </div>
            <p className="text-xl font-bold text-primary">{formatCurrency(account.balance)}</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center text-muted-foreground mb-1">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">Account Holder</span>
            </div>
            <p className="text-xl font-bold">{account.placeholder}</p>
          </div>

          <div className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Expiry Date</span>
            </div>
            <p className="text-xl font-bold">{account.due_date}</p>
          </div>
        </motion.div>

        <motion.div
          className="p-4 bg-muted rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-xs text-muted-foreground mt-1">Your account is active and in good standing</p>
            </div>
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

