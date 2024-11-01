// Home.tsx
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginRegister from './Login';

const Home: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Welcome to Trivia Game
        </Typography>
        
        <Box sx={{ width: '100%', mb: 4 }}>
          <LoginRegister mode="Login" />
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register">
            Register here
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;