import { Box, Container, Typography, Paper, Stack, } from '@mui/material';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';


export interface PortalProps {
    highScore: number;
    newScore: number;
}

const Portal: React.FC = ( ) => {
    const authContext = useContext(AuthContext);
    // const { userEmail } = useContext(AuthContext);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext?.token) {
            navigate('/');
        }
    }, [authContext?.token, navigate]);
   
    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ mb: 4, color: '#3f51b5', fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome to Trivia Game!
                </Typography>

                <Stack spacing={3}>
                    <Paper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'  }}>
                        <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
                            Quick Start
                        </Typography>
                        <Typography>
                            Click <Link to="/play" style={{textDecoration: 'none', color: '#3f51b5', fontWeight: 'bold' }}>Play</Link> to start a new game. Select your difficulty level and spin the wheel!
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
                            How to Play
                        </Typography>
                        <Typography component="div">
                            <Stack spacing={1}>
                                <Box>1. Choose your difficulty level</Box>
                                <Box>2. Spin the wheel to get a category</Box>
                                <Box>3. Answer questions within the time limit</Box>
                                <Box>4. Score points for correct answers</Box>
                            </Stack>
                        </Typography>
                     </Paper>    
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Your Stats</Typography>
                        <Typography>
                            Games Played:
                            <br />
                            Rank: 
                            <br />
                            High Score: 
                        </Typography>
                    </Paper>

                    
                   

                </Stack>
            </Box>
        </Container>
    );
};

export default Portal;