import React, { useEffect, useState} from 'react';
import './styles/index.css';
// import reportWebVitals from './reportWebVitals';
import { Routes, Route, useLocation} from "react-router-dom";
import Home from './components/Home';
import Reports from './components/Reports';
import AddWorker from './components/AddWorker';
import Navbar from './components/Navbar';
import Login from './components/Login';
import jwt_decode from "jwt-decode";
import { UserContext } from './shared/UserContext';
import PrivateRoutes from './shared/PrivateRoutes'

export default function App() {

    const myRoutes = ['/worker', '/reports', '/home']
    const location = useLocation();
    const [userDataInfo, setUserDataInfo] = useState({});
    useEffect(() => {
            const syncData = () => {
                if (localStorage.getItem('token') !== null) {
                    const myToken = localStorage.getItem('token')
                    const decodedToken = jwt_decode(myToken);
                    const userData = {
                        token: myToken,
                        decoded: decodedToken,
                        first_name: decodedToken.first_name,
                        last_name: decodedToken.last_name,
                    };
                    if(Object.keys(userDataInfo).length === 0){
                        setUserDataInfo(userData);
                    }
                }
            }
        syncData()
    })

    return (
        <div key='uniqueKey'>
            {myRoutes.includes(location.pathname) ? <Navbar /> : null}
            
            <UserContext.Provider value={{ userDataInfo }}>
                <Routes>
                    <Route element={<PrivateRoutes />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/worker" element={<AddWorker />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </UserContext.Provider>
        </div>
    )
}