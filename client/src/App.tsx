
import {Route, Routes } from 'react-router-dom'
import { createContext, useState} from 'react';
import './App.css'
import Header from './components/Header'
import LoginRegister from './components/Login';
import WheelComponent from './components/Wheel';
import Home from './components/Home';
import Portal from './components/Portal'


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

  return (
    <AuthContext.Provider value={{ token, setToken, userId, setUserId, userEmail, setUserEmail }}>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      {/* <Route path='/login' element={<LoginRegister mode ='Login'/>} /> */}
      <Route path='/register' element={<LoginRegister mode='Register' />} />
      <Route path='/play' element={<WheelComponent mode='Play'/>} />
      <Route path="/portal"  element={<Portal />} />
      {/* <Route path='/leaderboard' element={<Leaderboard />} /> */}
      {/* <Route path='/admin' element={<Auth><Admin /></Auth> } /> */}
      
    </Routes>
  </AuthContext.Provider>
  )
}

export default App
