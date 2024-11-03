
import {Route, Routes } from 'react-router-dom'
import { createContext, useState} from 'react';
import './App.css'
import Header from './components/Header'
import LoginRegister from './components/Login';
import WheelComponent from './components/Wheel';
import Home from './components/Home';
import Portal from './components/Portal'
import Leaderboard from './components/Leaderboard';

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userId: number | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  userEmail: string | null;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined | any >(undefined);

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_BASE_URL;


  return (
    <AuthContext.Provider value={{ token, setToken, userId, setUserId, userEmail, setUserEmail, apiUrl }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center' }}>
        <Header />
        <main style={{ flex: 1, paddingTop: '64px' }}>
          <Routes>
            <Route path='/' element={<Home />} />
           
            <Route path='/register' element={<LoginRegister mode='Register' />} />
            <Route path='/play' element={<WheelComponent mode='Play'/>} />
            <Route path="/portal"  element={<Portal />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            
          </Routes>
        </main>
       </div>
  </AuthContext.Provider>
  )
}

export default App
