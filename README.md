# 🧩 User Service

This microservice handles **User CRUD operations** for the E-Commerce Microservices project.  
It uses **FastAPI**, **SQLAlchemy (async)**, and **MySQL (Cloud)**.

---

## 🚀 Features
- Create, Read, Update, Delete users  
- Async database connection using `aiomysql`  
- Environment variables managed with `.env`  
- Modular structure (`app/models`, `app/schemas`, `app/routes`, etc.)

---

## 🏗️ Folder Structure
```
user-service/                       
├── app/                           
│   ├── __init__.py
│   ├── database.py                
│   ├── models.py                  
│   ├── schemas.py
│   ├── error_handlers.py
│   ├── exceptions.py         
│   ├── services/
│   │   └── user_service.py
│   ├── routers/
│   │   └── users.py                
│   └── certs/
│       └── ca.pem                 
│
├── main.py                       
├── test_connection.py             
├── requirements.txt
├── .env                           
├── .gitignore
└── README.md

```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Pushpajit/E-Commerece-Microservice.git
```

### 2️⃣ Navigate to the User Service
```bash
cd E-Commerece-Microservice/user-service
```

### 3️⃣ Create and Activate Virtual Environment
```bash
python -m venv venv
source venv/bin/activate   # For Mac/Linux
venv\Scripts\activate      # For Windows
```

### 4️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 5️⃣ Setup Environment Variables
Create a `.env` file in the project root:
```bash
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_HOST=your_host
MYSQL_PORT=3306
MYSQL_DB=your_database
SSL_CA=path_to_ssl_certificate_if_any
```



### 6️⃣ Add SSL Certificate
Download the SSL key (ca.pem) from your Aiven Dashboard
```bash

app/certs/ca.pem

```
### 7️⃣ Run the Application

```bash

uvicorn main:app --reload


```

The app will run at 👉 `http://127.0.0.1:8000`

---

## 🧠 Testing Database Connection
```bash
python test_connection.py
```

---

