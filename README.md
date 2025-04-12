
# Laravel React Task Manager App

This is a task manager application built with Laravel (backend) and React (frontend). The application allows you to manage tasks, categories, and user authentication.

## Requirements

Before you begin, ensure you have the following installed:

- Docker & Docker Compose (for Docker-based setups)
- Laravel Sail (for Laravel Sail-based setup)
- Node.js & npm (for running React frontend locally)
- Composer (for Laravel dependencies)
- PHP (for Laravel local setup)

## Running the App

There are three ways to run this app locally:

1. **Running with Docker Compose**
2. **Running with Laravel Sail**
3. **Running Locally (without Docker)**

### 1. Running with Docker Compose

Docker Compose simplifies running both the Laravel backend and React frontend in a containerized environment. Follow the steps below:

#### Step 1: Clone the repository

```bash
git clone https://github.com/itamarack/laravel-react-task-manager.git
cd laravel-react-task-manager
```plaintext

#### Step 2: Build and start the containers

Ensure you are in the root directory of the project, and then run the following command to build and start the containers:

```bash
docker-compose up -d
```plaintext

This will build the Docker containers, start the app, and run it in the background.

#### Step 3: Access the app

- Laravel will be running at: `http://localhost/api`
- React frontend will be running at: `http://localhost`

#### Step 4: Running migrations and seeding the database

Once the containers are up, run the following command to set up the database:

```bash
docker-compose exec app php artisan migrate --seed
```plaintext

This will migrate the database and seed it with initial data.

#### Step 5: Running React frontend

To start the React development server, run the following:

```bash
docker-compose exec react npm start
```plaintext

This will run the React app on port `3000`.

### 2. Running with Laravel Sail

Laravel Sail is a lightweight Docker setup for Laravel development. To use Sail, follow the instructions below:

#### Step 1: Install Laravel Sail

If you have not already installed Laravel Sail, you can do so by running:

```bash
composer require laravel/sail --dev
```plaintext

#### Step 2: Start the Sail environment

Run the following command to start the Docker containers for your Laravel app:

```bash
./vendor/bin/sail up
```

This will start the application with Docker.

#### Step 3: Set up the database

Run the migrations to set up the database:

```bash
./vendor/bin/sail artisan migrate --seed
```

#### Step 4: Running React frontend

In a separate terminal, run the React app:

```bash
npm install
npm run dev
```

The React app will run on `http://localhost`.

### 3. Running Locally (Without Docker)

To run the app locally without Docker, you'll need to set up Laravel and React independently.

#### Step 1: Set up the backend (Laravel)

1. Clone the repository:

    ```bash
    git clone https://github.com/itamarack/laravel-react-task-manager.git
    cd laravel-react-task-manager
    ```

2. Install Laravel dependencies:

    ```bash
    composer install
    ```

3. Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

4. Set up your environment variables in `.env` (such as database credentials).

5. Generate the application key:

    ```bash
    php artisan key:generate
    ```

6. Run migrations to set up the database:

    ```bash
    php artisan migrate --seed
    ```

7. Serve the Laravel app:

    ```bash
    php artisan serve
    ```

This will start the Laravel app at `http://localhost/api`.

#### Step 2: Set up the frontend (React)

1. Navigate to the frontend directory:

    ```bash
    cd frontend/
    ```

2. Install React dependencies:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm run dev
    ```

The React app will run on `http://localhost`.

#### Step 3: Update API URLs

Ensure that your React frontend is making API requests to the correct backend URL. If you're running the Laravel app locally, the React app should point to `http://localhost/api` or whatever URL your Laravel app is hosted on.

---

## Directory Structure

```
├── app/                 # Laravel application
├── frontend/            # React frontend application
├── docker-compose.yml   # Docker Compose configuration
├── .env                 # Environment variables for Laravel
├── composer.json        # Laravel dependencies
├── package.json         # React dependencies
└── README.md            # This file
```

---

## Common Commands

### Docker Commands

- **Build the containers**: `docker-compose build`
- **Start the containers**: `docker-compose up -d`
- **Stop the containers**: `docker-compose down`
- **View logs**: `docker-compose logs -f`
- **Run Artisan commands in Docker**: `docker-compose exec app php artisan [command]`
  
### Sail Commands

- **Start Sail**: `./vendor/bin/sail up`
- **Run Artisan commands in Sail**: `./vendor/bin/sail artisan [command]`
  
---

## Environment Variables

Make sure to configure your `.env` file with the correct values:

- **APP_NAME**: The name of your application.
- **DB_CONNECTION**: Database connection (MySQL, SQLite, etc.).
- **DB_HOST**: Database host.
- **DB_PORT**: Database port (default is `3306` for MySQL).
- **DB_DATABASE**: Database name.
- **DB_USERNAME**: Database username.
- **DB_PASSWORD**: Database password.
- **MAIL_**: Email configuration for sending emails.

---

## Troubleshooting

- **Docker**: If the containers don't start properly, try running `docker-compose down` to stop and remove the containers, then rebuild and restart using `docker-compose up`.
- **React**: If React isn't rendering correctly, ensure your backend API is accessible and that the URLs in the React app point to the correct endpoint.
  
---

## License

Include your license here, e.g., MIT, GPL, etc.

---
