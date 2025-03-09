export interface User {
    id: string
    name: string
    lastname: string
    age: number
    email: string
    phone: string
    gender: "M" | "F"
    documentType: string
    documentNumber: string
    createdAt?: string
    updatedAt?: string
  }
  
  