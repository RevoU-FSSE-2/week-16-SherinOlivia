[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/GB9tUzun)
# Week 16 Assignment Overview

For this week's assignment, we are tasked to implement cookies and limit the login attempts in our backend project.

The capabilities of the project are:
1. CRUD Implementation 
- Create
- Read
- Update
- Delete (isDeleted / soft delete)
2. Database 
- MySQL (& Localhost)
3. Authentication and Authorization
- Authentication: JWT (& Bcrypt)
- Authorization: Role-Based Access Control (RBAC)

##  Project Features:
- **Theme**: Order & Inventory Tracker
- **BCrypt** for Password Hashing
- **JWT** for Authentication and Authorization
- **Node-cache** for caching tokens (access token & refresh token)
- **Typescript** as the programming language
- **MySQL** for the database service
- **Railway** as the deployment platform
## Planning: Diagram

**Business:**
![business-flowchart](https://raw.githubusercontent.com/SherinOlivia/public-photos-repo/main/week11/BusinessFlowChart.webp)

**Technical:**
![technical-flowchart](https://raw.githubusercontent.com/SherinOlivia/public-photos-repo/main/week11/ProjectMilestone2.webp)


## API Endpoints

<p align="center">
<a href="https://w16sh.up.railway.app/">w16sh.up.railway.app</a>
</p> 

## Sample Accounts
```JSON
Cust:
    "email": "raven@gmail.com",
    "password":"raven321"
```
```JSON
Staff:
    "email":"zoya@gmail.com",
    "password":"zoya123"
```
```JSON
Admin:
    "email":"adminr00@gmail.com",
    "password":"R00isADMIN"
```
<br>

## Request Required Data:
**USERS:**
```JSON
Register (default role: cust):
{
    "username":"yourUsername",
    "email": "your@email.com",
    "password":"yourP4ssw0rd"
}
```
```JSON
Register by Admin (can give roles: cust, staff, admin):
{
    "username":"yourUsername",
    "email": "your@email.com",
    "password":"yourP4ssw0rd",
    "role": "role"
}
```
```JSON
Login:
{
    "email": "your@email.com",
    "password":"yourP4ssw0rd"
}
```
```JSON
Password Reset Request:
{
    "email": "your@email.com"
}
```
```JSON
Password Reset:
{
    "password":"yourN3WP4ssw0rd"
}
```
```JSON
Update (parameter: userId):
{
    "name":"yourName",
    "address":"yourAddress(city/country)"
}
```
<br>

**PRODUCTS:**
```JSON
Create New:
{
    "name":"yourProductName",
    "qty": productQty,
    "price": productPrice
}
```
```JSON
Update (parameter: productId):
{
    "qty": productQty,
    "price": productPrice
}
```
<br>

**ORDERS:**
```JSON
Create New:
{
    "custId": custId, (<== unneeded if login as cust)
    "product_name": "productName",
    "order_qty": orderQty,
}
```
```JSON
Update (parameter: orderId):
{
    "status": "completed / cancelled", (<== choose 1 cause enums)
}
```
<br>

## API Endpoints
<p align="center">
<a href="https://w16sh.up.railway.app/">w16sh.up.railway.app</a>
</p> 

**USERS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w16sh.up.railway.app/) | ❌ | ❌ |
| **Register User** | `POST` | [/api/users/register](https://w16sh.up.railway.app/api/users/register) | ❌ | ❌ |
| **Register User By Admin** | `POST` | [/api/users/admin/register](https://w16sh.up.railway.app/api/users/admin/register) | ✔ | **admin** |
| **Login User** | `POST` | [/api/users/login](https://w16sh.up.railway.app/api/users/login) | ❌ | ❌ |
| **Request Refresh Token** | `POST` | [/api/users/refresh](https://w16sh.up.railway.app/api/users/refresh) | ✔ | ❌ |
| **Update Name & Address** | `PATCH` | [/api/users/update/{id}](https://w16sh.up.railway.app/api/users/update/4) | ✔ | **cust**, **staff**, **admin** |
| **List All Cust Data** | `GET` | [/api/users/cust](https://w16sh.up.railway.app/api/users/cust) | ✔ | **staff**, **admin** |
| **List All User Data** | `GET` | [/api/users](https://w16sh.up.railway.app/api/users) | ✔ | **admin** |
| **Get Specific User Data ('cust' can only see their own)** | `GET` | [/api/users/profile/{id}](https://w16sh.up.railway.app/api/users/profile/1) | ✔ | **cust**, **staff**, **admin** |
| **User Profile (each user sees their own)** | `GET` | [/api/users/profile](https://w16sh.up.railway.app/api/users/profile) | ✔ | **cust**, **staff**, **admin** |
</div>

**PRODUCTS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w16sh.up.railway.app/) | ❌ | ❌ |
| **Create New Product** | `POST` | [/api/products/new](https://w16sh.up.railway.app/api/products/new) | ✔ | **staff**, **admin** |
| **Update Qty & Price** | `PATCH` | [/api/products/update/{id}](https://w16sh.up.railway.app/api/products/update/4) | ✔ | **staff**, **admin** |
| **Get Product by ID** | `GET` | [/api/products/{id}](https://w16sh.up.railway.app/api/products/1) | ❌ | ❌ |
| **List All Products** | `GET` | [/api/products](https://w16sh.up.railway.app/api/products) | ❌ | ❌ |
</div>

**ORDERS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w16sh.up.railway.app/) | ❌ | ❌ |
| **Create New Order** | `POST` | [/api/orders/new](https://w16sh.up.railway.app/api/orders/new) | ✔ | **cust**, **staff**, **admin** |
| **Update Order Status** | `PATCH` | [/api/orders/update/{id}](https://w16sh.up.railway.app/api/orders/update/4) | ✔ | **staff**, **admin** |
| **Delete Order (Soft Delete)** | `DELETE` | [/api/orders/delete/{id}](https://w16sh.up.railway.app/api/orders/delete/4) | ✔ | **cust**, **staff**, **admin** |
| **Get All Orders History (active + deleted)** | `GET` | [/api/orders/history](https://w16sh.up.railway.app/api/orders/history) | ✔ | **admin** |
| **List All Orders by Cust ID** | `GET` | [/api/orders/{custId}](https://w16sh.up.railway.app/api/orders/{custId}) | ✔ | **staff**, **admin** |
| **List All Orders** | `GET` | [/api/orders](https://w16sh.up.railway.app/api/orders) | ✔ | **cust**, **staff**, **admin** |
</div>

## How to Run the App

For testing purposes, please use `Postman` / `Thunder Client` VSCode extension.

Otherwise:
- git clone or download this repository to your machine
- install the necessities: `pnpm i` / `npm i`
- use the `.env.example` to create your own `.env` file and fill it with your data
- `Admin` (aka `Super User`) is automatically generated through a function placed in `src/config/AdminConfig`, please contact me if you want me to delete the `admin` data manually from database for any testing needs!

### Contact Me:

<img src="https://raw.githubusercontent.com/RevoU-FSSE-2/week-7-SherinOlivia/3dd7cdf0d5c9fc1828f0dfcac8ef2e9c057902be/assets/gmail-icon.svg" width="15px" background-color="none">[SOChronicle@gmail.com](mailto:SOChronicle@gmail.com) [Personal]

<img src="https://raw.githubusercontent.com/RevoU-FSSE-2/week-7-SherinOlivia/3dd7cdf0d5c9fc1828f0dfcac8ef2e9c057902be/assets/gmail-icon.svg" width="15px" background-color="none">[SOlivia198@gmail.com](mailto:SOlivia198@gmail.com) [Work]

[![Roo-Discord](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-discord.svg)](https://discord.com/users/shxdxr#7539)[![Roo-Instagram](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-instagram.svg)](https://instagram.com/shxdxr?igshid=MzRlODBiNWFlZA==)[![Roo-LinkedIn](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-linkedin-circled.svg)](https://www.linkedin.com/in/sherin-olivia-07311127a/)