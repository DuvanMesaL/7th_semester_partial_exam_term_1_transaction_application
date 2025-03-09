import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAccount } from "@/services/accountService"
import type { Account } from "@/types/account"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AccountSummary } from "@/components/ui/account-summary"
import { CreditCard } from "@/components/ui/credit-card"
import { motion } from "framer-motion"

const Accounts = () => {
  const { user } = useAuth()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccount = async () => {
      if (user?.id) {
        try {
          const accountData = await getUserAccount(user.id)
          setAccount(accountData)
        } catch (error) {
          console.error("Error fetching account:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAccount()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Account</h2>
        <p className="text-muted-foreground">View and manage your banking account</p>
      </div>

      {account ? (
        <motion.div
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AccountSummary account={account} />

          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Your virtual card information</CardDescription>
            </CardHeader>
            <CardContent>
              <CreditCard
                number={account.number}
                holderName={account.placeholder}
                expiryDate={account.due_date}
                cvc={account.cvc}
                variant="platinum"
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/transfer">Make a Transfer</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/transactions">View Transactions</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Account Found</CardTitle>
            <CardDescription>You don't have an active banking account</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please contact customer support to open a new account.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Accounts

