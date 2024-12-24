# Blog's Backend

## 📜 Description
> This is the backend of my blog. It is designed to connect with a MongoDB database and implement all the business logic and system requirements. It follows a simple CRUD architecture, but I've added an interaction feature to enhance the user experience (UX).

<br>
You can check the diagram below to see how the system works:
<img src="/public/images/backend_mongodb_diagram.png" alt="Backend system diagram"><br><br><br>

## 📜 Documentation

> For detailed documentation, including Functional Requirements, Non-Functional Requirements, Database Modeling, and API endpoints, you can refer to the following resources:

- [System Requirements and Database Modeling](/public/documents/System%20Requirements%20and%20Database%20Modeling.pdf)
- [API Documentation (Swagger)](http://localhost:3000/api/docs)
<br><br>

## 🚀 Technologies
> These are the main technologies used in this API:
<div style="display: flex; flex-direction: column; text-align: left; gap: 10px;">
  <div style="display: flex; flex-direction: row; align-items: center; list-style-type: disc; gap: 10px;">
    <span>•</span>
    <img src="https://img.shields.io/badge/Nest.js-000000?style=for-the-badge&logo=nestjs&logoColor=white" alt="Nest.js" />
    <a href="https://nestjs.com/">Nest.js</a>
    - Node.js framework
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
    <span>•</span>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
        <a href="https://www.typescriptlang.org/">TypeScript</a>
    - Programming language
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
    <span>•</span>
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <a href="https://www.mongodb.com/">MongoDB</a>
    - NoSQL database
  </div>
  <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
    <span>•</span>
    <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
        <a href="https://mongoosejs.com/">Mongoose</a>
    - ODM for MongoDB
  </div>
</div><br><br>

## 🛠️ Features
> The main backend features, with implementation progress:
- [x] **User CRUD**: Implemented for creating, reading, updating, and deleting users.
- [x] **Post CRUD**: Basic functionality for creating, updating, retrieving, and deleting posts. Currently, only the admin user can create and edit posts.
- [x] **Comment CRUD**: Basic functionality for creating, updating, retrieving, and deleting comments.
- [x] **Likes and Dislikes CRUD**: Basic functionality for managing likes and dislikes on posts or comments.
- [x] **Authentication and Authorization (JWT)**: Implemented JWT-based authentication and role-based authorization.
- [x] **Data Validation and Sanitization**: Input data is validated and sanitized to prevent security issues such as SQL injection and XSS.
- [ ] **Logging**: Pending implementation in the next cycle. Planning to use `winston` or Nest.js built-in logger for centralized logging.
- [x] **Error Handling**: Implemented custom exception filters to catch errors and return consistent, user-friendly responses.
- [ ] **Caching (Redis)**: Pending implementation in the next cycle. Will use Redis for caching frequently accessed data to improve performance.
- [ ] **Rate Limiter**: Pending implementation in the next cycle. Planning to use a rate limiter (e.g., `@nestjs/throttler`) to prevent abuse and control request frequency.
- [ ] **Email Validation**: Pending implementation in the next cycle. Email validation will be implemented during the user registration process, with a confirmation email sent to the user.
<br><br>

## 🛡️ User Roles and Permissions

> Currently, the system has the following user roles and permissions:

- **Admin**: Full access to the system. Can create, update, and delete posts and manage users.
- **Regular User**: Can read posts and comments but does not have permission to create or edit posts.
  
At this stage, only the **Admin** role is able to create posts on the platform.

<br><br>

## 📂 Project Structure
> The structure of this project is organized as follows:

```
├── app.module.ts
├── auth
│   ├── auth.controller.ts
│   ├── auth.d.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── decorator
│   │   ├── get-user.decorator.ts
│   │   └── index.ts
│   ├── dto
│   │   ├── create-user.dto.ts
│   │   ├── index.ts
│   │   └── login-user.dto.ts
│   └── strategy
│       ├── index.ts
│       └── jwt.strategy.ts
├── database
│   ├── mongoose.module.ts
│   └── mongoose.service.ts
├── guards
│   ├── index.ts
│   ├── jwt.guard.ts
│   └── username.guard.ts
├── interactions
│   ├── dto
│   │   ├── create-comment.dto.ts
│   │   └── index.ts
│   ├── interactions.controller.ts
│   ├── interactions.d.ts
│   ├── interactions.module.ts
│   └── interactions.service.ts
├── main.ts
├── post
│   ├── dto
│   │   ├── create-post.dto.ts
│   │   ├── index.ts
│   │   └── update-post.dto.ts
│   ├── post.controller.ts
│   ├── post.module.ts
│   └── post.service.ts
├── schemas
│   ├── comments.schema.ts
│   ├── post.schema.ts
│   ├── replies.schema.ts
│   └── user.schema.ts
└── user
    ├── dto
    │   ├── index.ts
    │   └── update-user.dto.ts
    ├── user.controller.ts
    ├── user.module.ts
    └── user.service.ts
```

### Explanations for each folder/file:

1. **auth**: Contains everything related to authentication and authorization, including controllers, services, JWT strategies, and DTOs for login and registration.
2. **database**: Holds database configurations and services related to MongoDB and Mongoose.
3. **guards**: Contains security-related guards like JWT validation and other route-specific validations.
4. **interactions**: Handles user interactions such as comments, likes, and dislikes.
5. **post**: Manages all post-related functionality, including CRUD operations and business logic.
6. **schemas**: Defines Mongoose schemas for MongoDB collections (posts, comments, users, and replies).
7. **user**: Manages CRUD operations related to users, including profile updates.
<br><br>

## 📦 Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Eduardofp17/blog.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd blog/backend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   - Copy `.env.example` to `.env` and update the values accordingly.

5. **Run the application**:
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3393/api`.
<br><br>

## 🧪 Testing

This project uses [Jest](https://jestjs.io/) and [PactumJS](https://pactumjs.github.io/) for end-to-end (e2e) testing. To run the tests, use the following command:

```bash
npm run test:e2e
```
<br><br>

## 📜 License

> This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for more information.
