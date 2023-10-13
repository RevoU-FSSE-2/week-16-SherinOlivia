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

**USERS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w16sh.up.railway.app/) | ❌ | ❌ |
| **Register User** | `POST` | [/api/users/register](https://w16sh.up.railway.app/api/users/register) | ❌ | ❌ |
| **Login User** | `POST` | [/api/users/login](https://w16sh.up.railway.app/api/users/login) | ❌ | ❌ |
| **Update Name & Address** | `PATCH` | [/api/users/update/{id}](https://w16sh.up.railway.app/api/users/update/4) | ✔ | **cust**, **staff**, **admin** |
| **List All Cust Data** | `GET` | [/api/users/cust](https://w16sh.up.railway.app/api/users/cust) | ✔ | **staff**, **admin** |
| **List All User Data** | `GET` | [/api/users](https://w16sh.up.railway.app/api/users) | ✔ | **admin** |
</div>

**PRODUCTS**
<div align="center">

| Name  | HTTP Method | Endpoint | Authentication | Authorization |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **Homepage** | `GET` |[/](https://w16sh.up.railway.app/) | ❌ | ❌ |
| **Create New Product** | `POST` | [/api/products/new](https://w16sh.up.railway.app/api/products/new) | ✔ | **staff**, **admin** |
| **Update Qty & Price** | `PATCH` | [/api/products/update/{id}](https://w16sh.up.railway.app/api/products/update/4) | ✔ | **staff**, **admin** |
| **Get Product by ID** | `GET` | [/api/products/{id}](https://w16sh.up.railway.app/api/products/cust) | ❌ | ❌ |
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

For testing purposes, please access the API Documentation link above. 

Otherwise:
- git clone or download this repository to your machine
- install the necessities: `pnpm i` / `npm i`
- use the `.env.example` to create your own `.env` file and fill it with your data
- Reminder: `Admin` (`Super User`) is generated automatically through a function placed in `src/config/AdminConfig`, please be warned!

### Contact Me:

<img src="https://raw.githubusercontent.com/RevoU-FSSE-2/week-7-SherinOlivia/3dd7cdf0d5c9fc1828f0dfcac8ef2e9c057902be/assets/gmail-icon.svg" width="15px" background-color="none">[SOChronicle@gmail.com](mailto:SOChronicle@gmail.com) [Personal]

<img src="https://raw.githubusercontent.com/RevoU-FSSE-2/week-7-SherinOlivia/3dd7cdf0d5c9fc1828f0dfcac8ef2e9c057902be/assets/gmail-icon.svg" width="15px" background-color="none">[SOlivia198@gmail.com](mailto:SOlivia198@gmail.com) [Work]

[![Roo-Discord](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-discord.svg)](https://discord.com/users/shxdxr#7539)[![Roo-Instagram](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-instagram.svg)](https://instagram.com/shxdxr?igshid=MzRlODBiNWFlZA==)[![Roo-LinkedIn](https://raw.githubusercontent.com/RevoU-FSSE-2/week-5-SherinOlivia/bddf1eca3ee3ad82db2f228095d01912bf9c3de6/assets/MDimgs/icons8-linkedin-circled.svg)](https://www.linkedin.com/in/sherin-olivia-07311127a/)