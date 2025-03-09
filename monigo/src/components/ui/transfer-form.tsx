import { useState, useEffect } from "react";
import { getAccountByNumber, transferMoney } from "@/services/accountService";
import type { Account } from "@/types/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface TransferFormProps {
  senderAccountId: string;
  senderAccountNumber: string;
  availableBalance: number;
  onSuccess?: () => void;
}

export function TransferForm({ senderAccountId, senderAccountNumber, availableBalance, onSuccess }: TransferFormProps) {
  const { toast } = useToast();
  const [transferData, setTransferData] = useState({
    receiverAccountNumber: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Estados para los nombres (placeholders) de las cuentas
  const [senderAccountPlaceholder, setSenderAccountPlaceholder] = useState<string | null>(null);
  const [receiverAccountPlaceholder, setReceiverAccountPlaceholder] = useState<string | null>(null);

  // 🔹 Cargar el nombre del remitente al iniciar
  useEffect(() => {
    const fetchSenderPlaceholder = async () => {
      try {
        const senderAccount = await getAccountByNumber(senderAccountNumber);
        setSenderAccountPlaceholder(senderAccount.placeholder || "Unknown");
      } catch (error) {
        console.error("Error fetching sender account:", error);
      }
    };
    fetchSenderPlaceholder();
  }, [senderAccountNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateStep1 = async () => {
    if (!transferData.receiverAccountNumber) {
      setError("Recipient account number is required");
      return false;
    }

    if (transferData.receiverAccountNumber === senderAccountNumber) {
      setError("You cannot transfer money to your own account");
      return false;
    }

    try {
      const receiverAccount = await getAccountByNumber(transferData.receiverAccountNumber);
      setReceiverAccountPlaceholder(receiverAccount.placeholder || "Unknown"); // ✅ Guardamos el nombre de la cuenta destino
      return true;
    } catch (error) {
      setError("Recipient account not found");
      return false;
    }
  };

  const validateStep2 = () => {
    if (!transferData.amount || Number.parseFloat(transferData.amount) <= 0) {
      setError("Please enter a valid amount greater than zero");
      return false;
    }

    if (Number.parseFloat(transferData.amount) > availableBalance) {
      setError("Insufficient funds for this transfer");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await validateStep1();
      if (isValid) setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      await transferMoney({
        senderAccountNumber,
        receiverAccountNumber: transferData.receiverAccountNumber,
        amount: Number.parseFloat(transferData.amount),
      });

      toast({
        title: "Transfer successful",
        description: `${formatCurrency(Number.parseFloat(transferData.amount))} has been transferred successfully`,
      });

      // Reset form
      setTransferData({
        receiverAccountNumber: "",
        amount: "",
      });
      setStep(1);
      setReceiverAccountPlaceholder(null); // Resetear nombre del destinatario

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Transfer failed",
        description: error.message || "An error occurred during the transfer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className="space-y-4">
              <Label htmlFor="receiverAccountNumber">Recipient Account Number</Label>
              <Input
                id="receiverAccountNumber"
                name="receiverAccountNumber"
                placeholder="Enter recipient's account number"
                value={transferData.receiverAccountNumber}
                onChange={handleChange}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={transferData.amount}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Available balance: {formatCurrency(availableBalance)}</p>
            </div>
          )}

          {step === 3 && (
            <motion.div className="space-y-4">
              <p>Confirm Transfer:</p>
              <p><strong>From:</strong> {senderAccountPlaceholder}</p>
              <p><strong>To:</strong> {receiverAccountPlaceholder}</p>
              <p><strong>Amount:</strong> {formatCurrency(Number.parseFloat(transferData.amount) || 0)}</p>
            </motion.div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>Back</Button>}
        {step < 3 ? (
          <Button onClick={handleNext}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Confirm Transfer"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
