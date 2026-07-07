# Prak React 1

This project is a React application that utilizes Supabase for user authentication and management. It includes features for user registration, login, and an admin interface for managing user data.

## Features

- User Registration: New users can create an account.
- User Login: Existing users can log in to access their accounts.
- Protected Routes: Certain routes are protected and require authentication.
- Admin Dashboard: Admin users can manage user data, including creating, updating, and deleting users.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- Supabase: An open-source Firebase alternative that provides a backend as a service.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Tailwind CSS: A utility-first CSS framework for styling.

## Project Structure

```
prak_react-1
├── src
│   ├── components
│   │   ├── Auth
│   │   ├── Admin
│   │   └── Layout
│   ├── pages
│   ├── services
│   ├── hooks
│   ├── types
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.js
└── tailwind.config.js
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd prak_react-1
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Supabase:
   - Create a Supabase account and project.
   - Configure your Supabase URL and public API key in the project.

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Navigate to the registration page to create a new account.
- After registration, log in using your new credentials.
- Access the admin dashboard to manage user data (admin access required).

## License

This project is licensed under the MIT License.