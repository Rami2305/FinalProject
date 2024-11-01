import {AppBar, Toolbar, Button, Stack, Typography, Box, Container} from '@mui/material'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'
import axios from 'axios'
import { Home, ExitToApp, EmojiEvents, SportsEsports } from '@mui/icons-material';
const Header: React.FC = () => {
    const authContext = useContext(AuthContext);
    const { token, setToken }:any = authContext;
    const logout = async () => {
        try {
            const response = await axios.delete('http://localhost:5000/user/logout');
            if (response.status === 200) {
                setToken(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                {/* Logo/Brand */}
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'flex' },
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    TRIVIA GAME
                </Typography>

                {/* Mobile Brand */}
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'flex', md: 'none' },
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    TG
                </Typography>

                {/* Navigation Buttons */}
                <Box sx={{ flexGrow: 0 }}>
                    <Stack 
                        direction="row" 
                        spacing={1}
                        sx={{
                            '& .MuiButton-root': {
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            },
                        }}
                    >
                        {token ? (
                            <>
                                <Button 
                                    component={Link} 
                                    to='/Portal'
                                    startIcon={<Home />}
                                >
                                    Portal
                                </Button>
                                <Button 
                                    component={Link} 
                                    to='/play'
                                    startIcon={<SportsEsports />}
                                >
                                    Play
                                </Button>
                                <Button 
                                    component={Link} 
                                    to='/leaderboard'
                                    startIcon={<EmojiEvents />}
                                >
                                    Leaderboard
                                </Button>
                                <Button 
                                    onClick={logout}
                                    startIcon={<ExitToApp />}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button 
                                component={Link} 
                                to='/'
                                startIcon={<Home />}
                            >
                                Home
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
);
};
    //     <Stack spacing={2} direction={'row'}>
    //     {token ? (
    //         <>
    //             <Button component={Link} to='/Portal'>Portal</Button>
    //             <Button component={Link} to='/play'>Play</Button>
    //             <Button component={Link} to='/leaderboard'>Leaderboard</Button>
    //             <Button onClick={logout}>Logout</Button>
    //         </>
    //     ) : (
    //         <Button component={Link} to='/'>Home</Button>
    //     )}
    // </Stack>
        // <Stack spacing={2} direction={'row'}>
        //     <Button component={Link} to='/login'>Login</Button>
        //     <Button component={Link} to='/register'>Register</Button>
        //     <Button component={Link} to='/'>Dashboard</Button>
        //     <Button component={Link} to='/play'>Play</Button>
        //     <Button component={Link} to='/admin'>Admin</Button>
        //     <Button onClick={logout}>Logout</Button>
        // </Stack>
//     );
// }

export default Header;