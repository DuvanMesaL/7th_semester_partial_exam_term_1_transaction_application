import { AccountRepository } from "../../repositories/accounts/account.repository";
import { TransactionRepository } from "../../repositories/transactions/transaction.repository";
import { AccountNotFoundError, InsufficientFundsError, InvalidTransactionError } from "../../../exceptions/exception";
import { sendEmail } from "../../../infrastructure/utils/sendEmail";
import { logEvent } from "../../../infrastructure/utils/logEvent";
import axios from "axios";

export class TransferFundsUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute(senderAccountNumber: string, receiverAccountNumber: string, amount: number, authToken: string) {
    console.log(`🔍 Buscando cuentas: Origen(${senderAccountNumber}) → Destino(${receiverAccountNumber})`);

    const senderAccount = await this.accountRepository.getAccountByNumber(senderAccountNumber);
    const receiverAccount = await this.accountRepository.getAccountByNumber(receiverAccountNumber);

    if (!senderAccount) throw new AccountNotFoundError("La cuenta de origen no existe.");
    if (!receiverAccount) throw new AccountNotFoundError("La cuenta de destino no existe.");
    
    const senderBalance = parseFloat(senderAccount.balance.toString());
    const receiverBalance = parseFloat(receiverAccount.balance.toString());

    if (amount <= 0) {
      throw new InvalidTransactionError("El monto de la transferencia debe ser mayor a cero.");
    }

    if (senderBalance < amount) {
      throw new InsufficientFundsError("Fondos insuficientes en la cuenta de origen.");
    }

    console.log("✔ Creando transacciones para la transferencia...");
    
    await this.transactionRepository.createTransaction(senderAccount.id, { type: "outcome", amount });
    await this.transactionRepository.createTransaction(receiverAccount.id, { type: "income", amount });

    const newSenderBalance = parseFloat((senderBalance - amount).toFixed(2));
    const newReceiverBalance = parseFloat((receiverBalance + amount).toFixed(2));

    await this.accountRepository.updateAccount(senderAccount.id, { balance: newSenderBalance });
    await this.accountRepository.updateAccount(receiverAccount.id, { balance: newReceiverBalance });

    console.log(`✅ Transferencia exitosa: $${amount} de ${senderAccountNumber} a ${receiverAccountNumber}`);

    let senderEmail, receiverEmail, senderName, receiverName;
    try {
      const senderUserResponse = await axios.get(`http://localhost:3001/user/${senderAccount.user_id}`, {
        headers: { Authorization: authToken }
      });

      senderEmail = senderUserResponse.data.email;
      senderName = senderUserResponse.data.name;

      if (!senderEmail) {
        throw new AccountNotFoundError("No se encontró el email del usuario remitente.");
      }

      const receiverUserResponse = await axios.get(`http://localhost:3001/user/${receiverAccount.user_id}`, {
        headers: { Authorization: authToken }
      });

      receiverEmail = receiverUserResponse.data.email;
      receiverName = receiverUserResponse.data.name;

      if (!receiverEmail) {
        throw new AccountNotFoundError("No se encontró el email del usuario destinatario.");
      }
    } catch (error: any) {
      console.log("⚠ Error obteniendo información de usuarios:", error.message);
      throw new AccountNotFoundError("Error obteniendo información de usuarios para la transferencia.");
    }

    try {
      await sendEmail(senderEmail, receiverEmail, "transfer", {
        sender: senderName,
        receiver: receiverName,
        amount,
        date: new Date().toISOString(),
      });
      console.log("📧 Correos de notificación enviados con éxito.");
    } catch (error: any) {
      console.log("⚠ Error enviando correos de transferencia:", error.message);
      await logEvent("transfer", "WARNING", `Error enviando correo: ${error.message}`);
    }

    return {
      message: `Transferencia de $${amount} realizada con éxito.`,
      senderAccountNumber,
      receiverAccountNumber,
      newSenderBalance,
      newReceiverBalance,
    };
  }
}
