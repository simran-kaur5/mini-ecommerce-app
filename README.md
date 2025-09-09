# Mini Ecommerce App 🛒

A simple **Mini Ecommerce** application built using **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JS**.  
This app allows you to manage customers, products, and orders with a simple frontend interface.

---

## Features

- View all customers
- View all products
- Place orders for existing customers
- Automatic signup option if customer does not exist
- View all orders with customer and product details
- Validates quantity > 0 when placing an order
- Responsive and interactive frontend

---

## Project Structure

miniProject/
│
├─ backend/
│ ├─ app.js # Main server file
│ ├─ package.json # Node dependencies
│ └─ node_modules/ # Installed packages
│
├─ frontend/
│ └─ index.html # Frontend HTML + JS + CSS
│
└─ .gitignore # Files to ignore in GitHub


---

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)
- **npm**
- **nodemon**

---

## Installation & Setup

1. **Clone the repository**:

```bash
git clone https://github.com/simrankaur-5/mini-ecommerce.git
cd mini-ecommerce/backend 
npm install
nodemon app.js

