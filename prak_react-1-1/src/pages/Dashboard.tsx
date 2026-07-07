import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { userData } = useUser(user?.id);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {userData ? (
            <div>
              <h2 className="text-xl">Welcome, {userData.username}!</h2>
              <p>Email: {userData.email}</p>
              {/* Additional user information can be displayed here */}
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;