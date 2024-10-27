
import {Route, Routes } from 'react-router-dom'
import { createContext, useState } from 'react';
import './App.css'
import Header from './components/Header'
import LoginRegister from './components/Login';
import WheelComponent from './components/Wheel';

interface AuthContextType {
  token:string | null | any;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken}}>
    <Header />
    <Routes>
      <Route path='/login' element={<LoginRegister mode ='Login'/>} />
      <Route path='/register' element={<LoginRegister mode='Register' />} />
      <Route path='/play' element={<WheelComponent mode='Play'/>} />
      {/* <Route path='/' element={<Dashboard />} /> */}
      {/* <Route path='/admin' element={<Auth><Admin /></Auth> } /> */}
      
    </Routes>
  </AuthContext.Provider>
  )
}

export default App
