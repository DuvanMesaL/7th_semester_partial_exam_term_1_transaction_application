# 🚀 7th Semester Partial Exam - Transaction Application

This project is a microservices-based application for managing transactions. Below, you will find the necessary steps to run the program in your development environment.

---

## 📌 Prerequisites

Before running the application, make sure you have the following requirements installed:

- **MongoDB** (NoSQL database engine)
- **PostgreSQL** (Relational database engine)
- **Node.js** and **npm** (Node.js package manager)
- **Git** (To clone the repository)

---

## 🚀 Steps to Run the Program

1. **Clone the repository**  
   Open a terminal and run the following command:
   ```bash
   git clone https://github.com/DuvanMesaL/7th_semester_partial_exam_term_1_transaction_application.git
   ```

2. **Open the project folder**  
   Navigate to the generated folder in the terminal or open it in **Visual Studio Code**.

3. **Install dependencies for the microservices**  
   Run the following commands in order:
   ```bash
   cd Back/microservice-account
   npm install

   cd ../Back/microservice-user
   npm install

   cd ../Back/microservice-logs
   npm install

   cd ../Back/microservice-mailing
   npm install
   ```

4. **Install dependencies for the frontend project**  
   ```bash
   cd ../../monigo
   npm install
   ```

5. **Run the project**  
   ```bash
   npm run dev
   ```

---

## ⚠️ Important Notes

- Ensure that **MongoDB** and **PostgreSQL** are running before starting the application.
- You can use **Docker** to manage databases if you prefer to avoid local installations.
- If you encounter dependency issues, try running:
  ```bash
  npm cache clean --force
  npm install
  ```
- If environment variables are required, check the `.env.example` file in each microservice.

---

## 🤝 Contributing

If you want to contribute to the project, feel free to do so! Follow these steps:

1. **Fork** the repository.
2. Create a new branch:  
   ```bash
   git checkout -b feature-new-functionality
   ```
3. Make your changes and commit:  
   ```bash
   git commit -m "Added new functionality"
   ```
4. Push your changes:  
   ```bash
   git push origin feature-new-functionality
   ```
5. Open a **Pull Request**.

---

### ✨ You're all set! Start working on the application now 🚀🎉


### ENJOY THE APP

## Login
![login](https://github.com/user-attachments/assets/b18b2a87-c011-4238-8f8b-8491088bef5f)

![Login](https://github.com/user-attachments/assets/f39f0b34-5278-4d89-835e-e439c86e2c26)

## Register
![register](https://github.com/user-attachments/assets/ffbf3a0a-9d1f-4728-bbea-65d57266c1b6)

![Register](https://github.com/user-attachments/assets/50f5acc6-3603-489d-b5e4-f3e22d3652ab)

## Dashboard
![Dashboard](https://github.com/user-attachments/assets/ba6132a6-c98b-4926-b890-8f2f3884ed91)

![DashBoard-1](https://github.com/user-attachments/assets/f1bd181c-ac7f-4c95-8d8f-c9c654fe2226)

![DashBoard-2](https://github.com/user-attachments/assets/de796d41-11df-45c4-8c24-d466edc55af4)

## Account
![Account](https://github.com/user-attachments/assets/6f409a46-6229-469a-a4d7-a4868e3727a0)

![Account](https://github.com/user-attachments/assets/62ce8cf0-1839-4ae7-a283-d11bbeb4cb3d)

## Transaction
![Transaction](https://github.com/user-attachments/assets/f29028b5-99f0-4803-80a6-7d00ae767ed0)

![Transaction](https://github.com/user-attachments/assets/5a3f91f5-e4cb-4e52-881c-1d835c8c09c8)

## Transer
![Transfer](https://github.com/user-attachments/assets/bce12fc9-b8ea-47ea-9945-b161bfcb7964)

![Transfer](https://github.com/user-attachments/assets/de2ce68b-0115-45e4-9899-65bf7a91de50)

## Profile
![Profile](https://github.com/user-attachments/assets/8858d5e7-e5c0-4ed0-931a-49b931781e83)

![Profile](https://github.com/user-attachments/assets/ae36123f-1b59-410a-ba8e-83351d567b2b)

## Security
![ProfileSecurity](https://github.com/user-attachments/assets/3e5f455f-5151-4561-ad1f-e462f278bf27)

![Security](https://github.com/user-attachments/assets/ce0d2bd2-1ad6-4569-a57a-75aa491aa012)

## SideBar
![SideBar](https://github.com/user-attachments/assets/69e44743-9dc4-4e88-a492-a94e7e5ab560)
