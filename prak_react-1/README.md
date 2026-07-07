# Prak React Project

This project is a React application that utilizes Supabase for user authentication and management. It includes features for user registration, login, and an admin dashboard for managing users.

## Project Structure

```
prak_react-1
├── src
│   ├── components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── UserManagement.tsx
│   ├── pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Admin.tsx
│   │   └── Dashboard.tsx
│   ├── services
│   │   └── supabaseClient.ts
│   ├── hooks
│   │   └── useAuth.ts
│   ├── types
│   │   └── user.ts
│   ├── App.tsx
│   └── main.tsx
├── vite.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **User Registration**: Users can create a new account using their email and password.
- **User Login**: Users can log in to their accounts.
- **Admin Dashboard**: Admins can manage users, view user statistics, and perform user management actions.
- **User Dashboard**: After logging in, users can access their personalized dashboard.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd prak_react-1
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Configure Supabase**:
   - Create a Supabase project at [Supabase.io](https://supabase.io).
   - Obtain your Supabase URL and public API key.
   - Update the `src/services/supabaseClient.ts` file with your Supabase credentials.

4. **Run the application**:
   ```
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- Navigate to the login page to log in with your credentials.
- If you don't have an account, go to the registration page to create a new account.
- Admin users can access the admin dashboard to manage users.

## License

This project is licensed under the MIT License.