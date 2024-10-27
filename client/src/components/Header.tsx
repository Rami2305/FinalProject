import {Button, Stack} from '@mui/material'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'
import axios from 'axios'

const Header: React.FC = () => {
    const authContext = useContext(AuthContext);
    const { setToken }:any = authContext;
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
        <Stack spacing={2} direction={'row'}>
            <Button component={Link} to='/login'>Login</Button>
            <Button component={Link} to='/register'>Register</Button>
            <Button component={Link} to='/play'>Play</Button>
            <Button component={Link} to='/'>Dashboard</Button>
            <Button component={Link} to='/admin'>Admin</Button>
            <Button onClick={logout}>Logout</Button>
        </Stack>
    );
}

export default Header;