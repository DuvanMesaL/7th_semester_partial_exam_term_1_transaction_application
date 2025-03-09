import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAccount, getAccountTransactions, createTransaction } from "@/services/accountService";
import type { Account, Transaction } from "@/types/account";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, Plus, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// Función para obtener el color de la transacción
const getTransactionColor = (type: string) => {
  const normalizedType = type.toLowerCase() as "income" | "outcome";

  if (normalizedType === "income") return "text-emerald-500";
  if (normalizedType === "outcome") return "text-rose-500";

  console.warn("Unknown transaction type:", type); // Debugging si hay datos inesperados
  return "text-gray-500"; // Color de fallback
};

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [newTransaction, setNewTransaction] = useState({ type: "income", amount: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const accountData = await getUserAccount(user.id);
          setAccount(accountData);

          if (accountData?.id) {
            const transactionsData = await getAccountTransactions(accountData.id);
            setTransactions(transactionsData);
            setFilteredTransactions(transactionsData);
          }
        } catch (error) {
          console.error("Error fetching transactions data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let filtered = transactions;

    if (transactionType !== "all") {
      filtered = filtered.filter((t) => t.type === transactionType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.amount.toString().includes(searchTerm) ||
          t.date.toString().includes(searchTerm) ||
          t.type.includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, transactionType, transactions]);

  const handleCreateTransaction = async () => {
    if (!account?.id || !newTransaction.amount || Number.parseFloat(newTransaction.amount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransaction(account.id, newTransaction.type, Number.parseFloat(newTransaction.amount));

      // Refresh transactions
      const transactionsData = await getAccountTransactions(account.id);
      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData);

      // Refresh account to get updated balance
      const accountData = await getUserAccount(user!.id);
      setAccount(accountData);

      toast({
        title: "Transaction created",
        description: `${newTransaction.type === "income" ? "Deposit" : "Withdrawal"} of ${formatCurrency(
          Number.parseFloat(newTransaction.amount)
        )} was successful`,
      });

      setNewTransaction({ type: "income", amount: "" });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message || "An error occurred while processing your transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full bg-opacity-10 ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === "income" ? (
                        <ArrowUpRight className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                      ) : (
                        <ArrowDownRight className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.type === "income" ? "Deposit" : "Withdrawal"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
