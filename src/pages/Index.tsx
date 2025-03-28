
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Dashboard from '../components/Dashboard';
import NavBar from '../components/NavBar';

const Index = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </Provider>
  );
};

export default Index;
