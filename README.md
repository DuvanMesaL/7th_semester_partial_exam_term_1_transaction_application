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
