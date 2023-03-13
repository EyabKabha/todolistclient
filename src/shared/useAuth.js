import { useState, useEffect  } from 'react';
import { Navigate, useLocation} from "react-router-dom";
import instance from '../api/connection';
import {toastError} from './toastWarning';
function useAuth() {
  const [token, setToken] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const checkAuth = async () => {
        try {
          const data = await instance.get(`/authvalidation/checkauth`, { headers: { "authorization": `${storedToken}` } })
          if (data.status === 200) {
            setToken(storedToken);
          } 
        } catch (error) {
          <Navigate to="/login"/>
          localStorage.removeItem('token');
          toastError(error.response.data.message);
        }
      }
      checkAuth()
    }
    
    }, [location]);
    return token
}

export default useAuth;