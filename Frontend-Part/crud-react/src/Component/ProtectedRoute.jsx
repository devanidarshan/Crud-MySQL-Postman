import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const cookieData = JSON.parse(Cookies.get("cookieData") || '{}');

    // cookieData is empty
    if (Object.keys(cookieData).length === 0) {
        alert("You Need To Login First...☠ ☠ ☠");
        return <Navigate to="/api/register-user" />;
    }

    return children;
};

export default ProtectedRoute;
