import React from 'react';
import { useAtom } from 'jotai';
import './app.css';
import { appPrivateKeyAtom, authResponseAtom, userAtom } from '../store/auth';

export const App: React.FC = () => {
  const [authResponse, setAuthResponse] = useAtom(authResponseAtom);
  const [appPrivateKey, setAppPrivateKey] = useAtom(appPrivateKeyAtom);
  const [user, setUser] = useAtom(userAtom);

  return (
    <div className="app">
      <h1>Heystack</h1>
    </div>
  );
};

export default App;
