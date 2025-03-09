import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAccount } from "@/services/accountService"
import type { Account } from "@/types/account"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { TransferForm } from "@/components/ui/transfer-form"
import { motion } from "framer-motion"

const Transfer = () => {
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

  const handleTransferSuccess = async () => {
    // Refresh account data to get updated balance
    if (user?.id) {
      try {
        const accountData = await getUserAccount(user.id)
        setAccount(accountData)
      } catch (error) {
        console.error("Error refreshing account:", error)
      }
    }
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transfer Money</h2>
        <p className="text-muted-foreground">Send money to another account</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {account ? (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <TransferForm
                senderAccountId={account.id}
                senderAccountNumber={account.number}
                availableBalance={account.balance}
                onSuccess={handleTransferSuccess}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Instructions</CardTitle>
                  <CardDescription>How to make a successful transfer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center">
                        <ArrowRight className="h-5 w-5 text-primary mr-2" />
                        <p className="text-sm font-medium">Available Balance</p>
                      </div>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <Card className="col-span-2">
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
    </div>
  )
}

export default Transfer
