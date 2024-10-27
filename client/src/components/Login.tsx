import axios from 'axios'
import {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button } from '@mui/material'
import { AuthContext } from '../App'

interface LoginRegisterProps {
  mode: 'Login' | 'Register';  
}

const LoginRegister: React.FC<LoginRegisterProps> = ({mode}) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const { setToken }:any = useContext(AuthContext);

  const navigate = useNavigate();
  const loginRegister = async () => {
    if (mode === 'Login') {
      try { 
          const response = await axios.post('http://localhost:5000/api/user/login', {
              email,
              password
          },
          {withCredentials:true}
          );

          if(response.status === 200) {
              setMessage(response.data.message)
              console.log(response.data);
              setToken(response.data.accessToken);
              navigate('/')
          }
      } catch (error:any) {
          console.log(error);

          setToken(null);
          
          setMessage(error.response.data.message)
          }
  } else if(mode ==='Register'){
      try { 
          const response = await axios.post('http://localhost:5000/api/user/register', {
              email,
              password
          },
          {withCredentials:true}
          );

          if(response.status === 201) {
              setMessage(response.data.message)
              console.log(response.data);
              navigate('/login')
          }
      } catch (error:any) {
          console.log(error);
          setMessage(error.response.data.message)
          }
    }
  }
  return (
    <>
    <h2>{mode}</h2>
        <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete='off'>
        <TextField
        sx={{ m: 1 }}
        id='email'
        type='email'
        label='Enter your email...'
        variant='outlined'
        onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
        sx={{ m: 1 }}
        id='password'
        type='password'
        label='Enter your password...'
        variant='outlined'
        onChange={(e) => setPassword(e.target.value)}
        />
    </Box>
    <Button variant='contained' onClick={loginRegister}>{mode}</Button>
    <div>{message}</div>
    </>
  )
}

export default LoginRegister