import { Outlet, Navigate } from 'react-router-dom'
// import useAuth  from '../shared/useAuth';
const PrivateRoutes = () => {
    const myToken = localStorage.getItem("token");
    // const isValid = useAuth()
    return(
        myToken ? <Outlet/>: <Navigate to="/login"/>
    )
}

export default PrivateRoutes
