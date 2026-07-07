import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './pertemuan-5/AppShell';

// AppShell renders immediately — Landing Page is public and doesn't need
// to wait for Supabase auth. AppShell handles auth state internally.
function AppContent() {
  return <AppShell />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
