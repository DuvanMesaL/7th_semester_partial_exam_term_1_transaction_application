export interface Account {
    id: string
    number: string
    placeholder: string
    cvc: string
    due_date: string
    user_id: string
    balance: number
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Transaction {
    id: string;
    account_id: string;
    type: "income" | "outcome";
    amount: number;
    date: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface TransferData {
    senderAccountNumber: string
    receiverAccountNumber: string
    amount: number
  }
  