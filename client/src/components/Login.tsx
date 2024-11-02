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
    const { setToken, setUserId, setUserEmail }: any = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');

      try {
        if (mode === 'Login') {
            const response = await authAPI.login({ email, password });
            setToken(response.accessToken);
            setUserId(response.userId);
            setUserEmail(response.userEmail);
            setMessage(response.message);
            navigate('/Portal');
        } else {
            const response = await authAPI.register({ email, password });
            setMessage(response.message);
            // Opcional: podrías auto-login después del registro o redirigir al login
            navigate('/login');
        }
    } catch (error: any) {
        console.error('Error:', error);
        if (mode === 'Login') {
            setToken(null);
            setUserId(null);
            setUserEmail(null);
        }
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
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
              }}
          >
              {/* Header */}
              <Typography component="h1" variant="h5" sx={{ mb: 3,  color: '#3f51b5', fontWeight: 'bold' }}>
                  {mode === 'Login' ? 'Login' : 'Register'}
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
                      sx={{ mt: 3, mb: 2, py: 1.5, backgroundColor: '#3f51b5', color: 'white', '&:hover': { backgroundColor: '#303f9f' } }}
                  >
                      {loading ? (
                          <CircularProgress size={24} color="inherit" />
                      ) : (
                          mode === 'Login' ? 'Login' : 'Register'
                      )}
                  </Button>

                  {/* Switch between Login/Register */}
                  <Button
                      fullWidth
                      variant="text"
                      onClick={() => navigate(mode === 'Login' ? '/register' : '/login')}
                      sx={{ mt: 1, color: '#3f51b5', '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.1)' } }}
                  >
                      {mode === 'Login' 
                          ? "Don't have an account? Register here"
                          : 'Already have an account? Log in'}
                  </Button>
              </Box>
          </Paper>
      </Container>
  );
};

export default LoginRegister;
