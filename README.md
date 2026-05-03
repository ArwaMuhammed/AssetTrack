# 🚀 **AssetTrack — Backend (Database Setup)**

## 📌 **Prerequisites**

Make sure you have the following installed:

* **Java 17+**
* **PostgreSQL**
* **IntelliJ IDEA (recommended)**

---

## 🗄️ **Database Setup**

### **1️⃣ Create Database**

Run in **pgAdmin**:

```sql
CREATE DATABASE assettrack_db;
```

---

### **2️⃣ Create Database User**

```sql
CREATE USER assettrack_user WITH PASSWORD '123456';

GRANT ALL PRIVILEGES ON DATABASE assettrack_db TO assettrack_user;

GRANT USAGE, CREATE ON SCHEMA public TO assettrack_user;

ALTER SCHEMA public OWNER TO assettrack_user;
```

---

## ⚙️ **Backend Configuration**

Open:

**src/main/resources/application.properties**

Ensure it contains:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/assettrack_db
spring.datasource.username=assettrack_user
spring.datasource.password=123456

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.sql.init.mode=never
```

---

## ▶️ **First Run (IMPORTANT)**

To initialize the database with sample data:

1. Change:

```properties
spring.sql.init.mode=always
```

2. Run the backend application.

### ✅ **This will:**

* Create all tables automatically
* Insert sample data

---

## 🔁 **After First Run**

Change back to:

```properties
spring.sql.init.mode=never
```

⚠️ This prevents duplicate data errors.

---

## 📊 **Database Tables**

The system automatically creates:

* **users**
* **assets**
* **asset_allocations**
* **condition_reports**
* **notifications**
* **accessory_stocks**

---

## 🧪 **Sample Data**

Sample records are inserted into:

* **users**
* **assets**
* **accessory_stocks**
* **notifications**

---

## 🏃 **Run Backend**

Run:

**BackendApplication.java**

### ✅ **Expected Output:**

```
Tomcat started on port 8080
Started BackendApplication
```

---

## 🧠 **Notes**

* Database schema is generated automatically using **Spring Data JPA**
* No manual SQL table creation is required
* All relationships (**foreign keys**) are already configured
* `data.sql` is used for **testing/demo only**

---

## 🎯 **Summary**

✔ Database schema designed

✔ Tables & relationships implemented

✔ Sample data added

✔ Ready for team usage
