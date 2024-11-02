import { authAPI } from '../config/axios'
import {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import {   Box,   TextField,   Button,   Container,   Paper,   Typography,   Alert,   CircularProgress,  IconButton,  InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { AuthContext } from '../App'

interface LoginRegisterProps {
  mode: 'Login' | 'Register';  
}
const LoginRegister: React.FC<LoginRegisterProps> = ({ mode }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setToken }: any = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');

      try {
        const response = await (mode === 'Login' 
            ? authAPI.login({ email, password })
            : authAPI.register({ email, password }));

        if (response.status === 200 || response.status === 201) {
            setMessage(response.data.message);
            if (mode === 'Login') {
                setToken(response.data.accessToken);
            }
            navigate('/Portal');
        }
    } catch (error: any) {
        console.error('Error:', error);
        if (mode === 'Login') setToken(null);
        setMessage(error.response?.data?.message || 'Error en el servidor');
    } finally {
        setLoading(false);
    }
};

  return (
      <Container component="main" maxWidth="xs">
          <Paper 
              elevation={3} 
              sx={{
                  marginTop: 8,
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
              }}
          >
              {/* Header */}
              <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                  {mode === 'Login' ? 'Iniciar Sesión' : 'Registrarse'}
              </Typography>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                  <Email color="action" />
                              </InputAdornment>
                          ),
                      }}
                  />
                  <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                  <Lock color="action" />
                              </InputAdornment>
                          ),
                          endAdornment: (
                              <InputAdornment position="end">
                                  <IconButton
                                      onClick={() => setShowPassword(!showPassword)}
                                      edge="end"
                                  >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                              </InputAdornment>
                          ),
                      }}
                  />

                  {/* Error Message */}
                  {message && (
                      <Alert 
                          severity={message.includes('Error') ? 'error' : 'success'}
                          sx={{ mt: 2 }}
                      >
                          {message}
                      </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                      {loading ? (
                          <CircularProgress size={24} color="inherit" />
                      ) : (
                          mode === 'Login' ? 'Iniciar Sesión' : 'Registrarse'
                      )}
                  </Button>

                  {/* Switch between Login/Register */}
                  <Button
                      fullWidth
                      variant="text"
                      onClick={() => navigate(mode === 'Login' ? '/register' : '/login')}
                      sx={{ mt: 1 }}
                  >
                      {mode === 'Login' 
                          ? '¿No tienes cuenta? Regístrate' 
                          : '¿Ya tienes cuenta? Inicia sesión'}
                  </Button>
              </Box>
          </Paper>
      </Container>
  );
};

export default LoginRegister;
// const LoginRegister: React.FC<LoginRegisterProps> = ({mode}) => {
//   const [email, setEmail] = useState<string>('')
//   const [password, setPassword] = useState<string>('')
//   const [message, setMessage] = useState<string>('')
//   const { setToken }:any = useContext(AuthContext);

//   const navigate = useNavigate();
//   const loginRegister = async () => {
//     if (mode === 'Login') {
//       try { 
//           const response = await axios.post('http://localhost:5000/api/user/login', {
//               email,
//               password
//           },
//           {withCredentials:true}
//           );

//           if(response.status === 200) {
//               setMessage(response.data.message)
//               console.log(response.data);
//               setToken(response.data.accessToken);
//               navigate('/Portal')
//           }
//       } catch (error:any) {
//           console.log(error);

//           setToken(null);
          
//           setMessage(error.response.data.message)
//           }
//   } else if(mode ==='Register'){
//       try { 
//           const response = await axios.post('http://localhost:5000/api/user/register', {
//               email,
//               password
//           },
//           {withCredentials:true}
//           );

//           if(response.status === 201) {
//               setMessage(response.data.message)
//               console.log(response.data);
//               navigate('/Portal')
//           }
//       } catch (error:any) {
//           console.log(error);
//           setMessage(error.response.data.message)
//           }
//     }
//   }
//   return (
//     <>
//     <h2>{mode}</h2>
//         <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete='off'>
//         <TextField
//         sx={{ m: 1 }}
//         id='email'
//         type='email'
//         label='Enter your email...'
//         variant='outlined'
//         onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//         sx={{ m: 1 }}
//         id='password'
//         type='password'
//         label='Enter your password...'
//         variant='outlined'
//         onChange={(e) => setPassword(e.target.value)}
//         />
//     </Box>
//     <Button variant='contained' onClick={loginRegister}>{mode}</Button>
//     <div>{message}</div>
//     </>
//   )
// }

// export default LoginRegister