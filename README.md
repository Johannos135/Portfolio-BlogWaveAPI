# BlogWave Blog Platform

BlogWave is a robust backend infrastructure for a modern blog platform. It empowers users to create, manage, and share their content seamlessly. Our focus is on building a scalable, secure, and feature-rich backend that will support a user-friendly frontend interface.

## Author

**Johanne ESSIERE**
- Email: essierejohanne1@gmail.com
- Github: [github.com/Johannos135](https://github.com/Johannos135)
- Linkedin: [linkedin.com/in/johanne-essiere](https://www.linkedin.com/in/johanne-essiere/)


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Milestones](#project-milestones)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Blog post creation, editing, and deletion
- Commenting system for blog posts
- Markdown editor for creating and formatting blog posts
- Header image upload for blog posts
- User reading history tracking
- Responsive design for various devices
- Search functionality for posts
- Pagination for post and comment listings

## Tech Stack

- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Caching:** Redis
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Testing:** Mocha, Chai, and Sinon

## Project Milestones

1. Implement user authentication
2. Set up MongoDB for storing blog posts and user data
3. Implement blog post CRUD operations
4. Create a user reading history feature
5. Develop a markdown editor for blog post creation
6. Implement header image upload functionality
7. Make the application responsive for various devices
8. Implement search functionality
9. Set up Redis for caching and performance optimization

## Getting Started

### Prerequisites

- Node.js (version 14.5.0 or higher)
- MongoDB (version 4.5.9 or higher)
- Redis (version 2.8.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Johannos135/Portfolio-BlogWaveAPI.git
   ```

2. Navigate to the project directory:
   ```
   cd Portfolio-BlogWaveAPI
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   DB_DATABASE=your_mongodb_database_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```
   npm start-server
   ```

## Usage

After starting the server, the API will be available at `http://localhost:3000` (or the port you've configured).

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Authenticate a user and receive a JWT

### Posts
- `GET /posts`: Retrieve a list of posts (paginated)
- `POST /posts`: Create a new post (requires authentication)
- `PUT /posts/:id`: Update a post (requires authentication)
- `DELETE /posts/:id`: Delete a post (requires authentication)
- `GET /posts/search`: Search for posts

### Comments
- `POST /comments`: Add a new comment to a post (requires authentication)
- `GET /posts/:postId/comments`: Retrieve comments for a specific post (paginated)

### User Reading History
- `GET /users/reading-history`: Retrieve a user's reading history (requires authentication)

### Image Upload
- `POST /posts/:id/header-image`: Upload a header image for a post (requires authentication)

## Testing

To run the tests:

```
npm test
```

The project uses Chai for assertions, Mocha as the test runner, and Sinon for stubbing database and Redis calls. Test files are located in the `test` directory and cover authentication, post management, and comment functionality.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request