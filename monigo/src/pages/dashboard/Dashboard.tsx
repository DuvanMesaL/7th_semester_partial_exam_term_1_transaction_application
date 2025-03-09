import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAccount, getAccountTransactions } from "@/services/accountService"
import type { Account, Transaction } from "@/types/account"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, CreditCard, DollarSign, ArrowLeftRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { TransactionList } from "@/components/ui/transaction-list"
import { motion } from "framer-motion"

const Dashboard = () => {
  const { user } = useAuth()
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const accountData = await getUserAccount(user.id)
          setAccount(accountData)

          if (accountData?.id) {
            const transactionsData = await getAccountTransactions(accountData.id)
            setTransactions(transactionsData)
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [user])

  const getIncomeTotal = () => {
    return transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)
  }

  const getOutcomeTotal = () => {
    return transactions.filter((t) => t.type === "outcome").reduce((sum, t) => sum + Number(t.amount), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of your account.</p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link to="/transfer">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Transfer
            </Link>
          </Button>
        </div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <DashboardCard
          title="Balance"
          value={formatCurrency(account?.balance || 0)}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          subtitle={`Account #${account?.number?.slice(-4)}`}
          variant="primary"
        />

        <DashboardCard
          title="Income"
          value={formatCurrency(getIncomeTotal())}
          icon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
          subtitle={`+${transactions.filter((t) => t.type === "income").length} transactions`}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />

        <DashboardCard
          title="Expenses"
          value={formatCurrency(getOutcomeTotal())}
          icon={<ArrowDownRight className="h-4 w-4 text-rose-500" />}
          subtitle={`-${transactions.filter((t) => t.type === "outcome").length} transactions`}
          variant="danger"
          trend={{ value: 5, isPositive: false }}
        />

        <DashboardCard
          title="Card"
          value={`**** ${account?.number?.slice(-4)}`}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          subtitle={`Expires: ${account?.due_date}`}
        />
      </motion.div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your last 5 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} limit={5} />

              <div className="mt-6">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/transactions">View all transactions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>A complete history of your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} showSearch={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard

