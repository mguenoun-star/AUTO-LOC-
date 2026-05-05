import React from 'react';
import RegisterLeftPanel from './components/RegisterLeftPanel';
import RegisterForm from './components/RegisterForm';

export default function Register() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <RegisterLeftPanel />
      <RegisterForm />
    </main>
  );
}
