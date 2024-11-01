import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';


export interface PortalProps {
    highScore: number;
}

const Portal: React.FC = ( ) => {
    const authContext = useContext(AuthContext);
    const { userEmail } = useContext(AuthContext);
    const [highScore, setHighScore] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext?.token) {
            navigate('/');
        }
    }, [authContext?.token, navigate]);
    useEffect(() => {
        const fetchUserHighScore = async () => {
          try {
            const response = await fetch(`/api/leaderboard/${userEmail}`);
            if (!response.ok) {
              throw new Error(`Error fetching user high score: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            setHighScore(data.score);
          } catch (error) {
            console.error('Error fetching user high score:', error);
          }
        };
        fetchUserHighScore();
      }, [userEmail]);
    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Welcome to Trivia Game!
                </Typography>

                <Stack spacing={3}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Quick Start
                        </Typography>
                        <Typography>
                            Click 'Play' to start a new game. Select your difficulty level and spin the wheel!
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Your Stats</Typography>
                        <Typography>
                            Games Played:
                            <br />
                            Rank: 
                            <br />
                            High Score: {highScore}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">
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

                </Stack>
            </Box>
        </Container>
    );
};

export default Portal;