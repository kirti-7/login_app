import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to={'/'} replace={true} ></Navigate>
    }
    return children;

}

export const ProtectRoute = ({ children }) => {
    const { username } = useAuthStore(state => state.auth);
    if(!username){
        return <Navigate to={'/'} replace={true} ></Navigate>
    }
    return children;
}

export const RedirectToProfile = ({ children }) => {
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to={'/profile'} replace={true} ></Navigate>
    }
    return children;
}