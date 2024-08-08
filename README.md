# Blog Site

A modern web application for creating and managing blog posts. Users can write, edit, delete, and view blog posts, as well as manage their profiles.

## Features

- Create, edit, and delete blog posts.
- View and comment on blog posts.
- Manage user profiles and settings.
- Secure user authentication and authorization.

## Technologies Used

- **MERN Stack**: MongoDB, Express.js Node.js,EJS
- **HTML ,CSS,JS**
- **Cloudinary**: For image storage and management
- **Multer**: Middleware for handling file uploads
- **JWT**: JSON Web Tokens for secure authentication
- **Bcrypt**: For hashing passwords

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/prakashMpandey/blog-website.git
    ```
2. Navigate to the project directory:
    ```bash
    cd blog-website
    ```
3. Install server-side dependencies:
    ```bash
    cd backend
    npm install
    ```


## Configuration

1. Create a `.env` file in the `server` directory with the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_jwt_secret
    REFRESH_TOKEN_SECRET
    REFRESH_TOKEN_EXPIRY
    ACCESS_TOKEN_EXPIRY
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    
2. Replace placeholder values with your actual configuration details.

## Usage

1. Start the server:
    ```bash
    cd backend/src
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000` to use the application.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact


- GitHub: [@prakashMpandey](https://github.com/prakashMpandey)

