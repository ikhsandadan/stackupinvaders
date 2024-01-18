import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useEffect } from 'react';

const Logout = ({setIsLogin, passportInstance, setDefaultAccount}) => {
    const navigate = useNavigate();

    const logout = async () => {
        // Log the user out
        localStorage.clear();
        await passportInstance.logout();
        navigateToHome();
        setIsLogin(false);
        setDefaultAccount("");
        navigateToHome();
    };

    const navigateToHome = () => {
        navigate("/");
    };

    useEffect(() => {
        logout();
    }, []);

    return (
        <div className="flex flex-col mx-10 gap-5 px-5 py-5 place-content-center text-center">
            <div className="font-sans text-4xl font-bold text-white">Thank You For Playing!</div>
            <div className="font-sans text-2xl font-bold text-white">Logging Out...</div>
            <Box sx={{ display: "flex", textAlign: "center", justifyContent: "center"}}>
                <CircularProgress sx={{ color: "white"}} />
            </Box>
        </div>
    )
}

export default Logout