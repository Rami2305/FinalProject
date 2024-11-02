import { Box, Container, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
import LoginRegister from './Login';

const Home: React.FC = () => {
  return (
  //   <Container maxWidth="sm">
  //     <Box sx={{ 
  //       marginTop: 8,
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'center'
  //     }}>
  //       <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
  //         Welcome to Trivia Game
  //       </Typography>
        
  //       <Box sx={{ width: '100%', mb: 4 }}>
  //         <LoginRegister mode="Login" />
  //       </Box>
  //     </Box>
  //   </Container>
  // );
  <Container maxWidth="sm">
  <Box sx={{
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
  }}>
    <Typography component="h1" variant="h4" sx={{ mb: 3, color: '#3f51b5', fontWeight: 'bold' }}>
      Welcome to Trivia Game
    </Typography>

    <Box sx={{ width: '100%', mb: 4 }}>
      <LoginRegister mode="Login" />
    </Box>
  </Box>
</Container>
);
};

export default Home;