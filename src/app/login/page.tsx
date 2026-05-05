import React from 'react';
import LoginLeftPanel from './components/LoginLeftPanel';
import LoginForm from './components/LoginForm';

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <LoginLeftPanel />
      <LoginForm />
    </main>
  );
}
