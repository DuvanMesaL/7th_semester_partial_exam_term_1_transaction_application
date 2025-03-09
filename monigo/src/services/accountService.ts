import { accountApi } from "./api"
import type { Account, Transaction, TransferData } from "@/types/account"

export const getUserAccount = async (userId: string): Promise<Account> => {
  try {
    const response = await accountApi.get(`/account/user/${userId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get account")
  }
}

export const getAccountByNumber = async (accountNumber: string): Promise<Account> => {
  try {
    const response = await accountApi.get(`/account/number/${accountNumber}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get account");
  }
};

export const getAccountTransactions = async (accountId: string): Promise<Transaction[]> => {
  try {
    const response = await accountApi.get(`/transaction/account/${accountId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get transactions")
  }
}

export const createTransaction = async (accountId: string, type: string, amount: number) => {
  try {
    const response = await accountApi.post("/transaction", {
      account_id: accountId,
      type,
      amount,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create transaction")
  }
}

export const transferMoney = async (transferData: TransferData) => {
  try {
    const response = await accountApi.post("/transaction/transfer", transferData)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to transfer money")
  }
}

