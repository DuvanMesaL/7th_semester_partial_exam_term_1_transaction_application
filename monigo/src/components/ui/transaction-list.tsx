import type { Transaction } from "@/types/account"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TransactionListProps {
  transactions: Transaction[]
  showSearch?: boolean
  limit?: number
}

export function TransactionList({ transactions, showSearch = false, limit }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState<string>("all")

  // Filter transactions based on search term and type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = transactionType === "all" || transaction.type === transactionType
    const matchesSearch =
      searchTerm === "" ||
      transaction.amount.toString().includes(searchTerm) ||
      formatDate(transaction.date).includes(searchTerm) ||
      transaction.type.includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  // Limit the number of transactions if specified
  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-2/3">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="type" className="sr-only">
              Transaction Type
            </Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Deposits Only</SelectItem>
                <SelectItem value="outcome">Withdrawals Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {displayedTransactions.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No transactions found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {displayedTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${transaction.type === "income" ? "bg-emerald-100 dark:bg-emerald-900/50" : "bg-rose-100 dark:bg-rose-900/50"}`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.type === "income" ? "Deposit" : "Withdrawal"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className={`font-medium ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

