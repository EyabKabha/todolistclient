import React, {  useEffect,useState ,useRef} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Reports from './components/Reports';
import AddWorker from './components/AddWorker';
import Navbar from './components/Navbar';
import Login from './components/Login';
import instance from './api/connection';
import jwt_decode from "jwt-decode";
import { UserContext } from './shared/UserContext';
import { toastError } from './shared/toastWarning';
export default function App() {
  const [lastName, setLastName] = useState();
  const [firstName,setFirstName] = useState();
  const [decoded,setDecoded] = useState();
  const [myToken,setMyToken] = useState();
  const navigate = useNavigate();

  const myRoutes = ['/worker', '/reports', '/home']
  const effectRan = useRef(false);
  const location = useLocation();

  const checkAuth = async () => {
      const myToken = localStorage.getItem("token");
      if(myToken!==null) {
        try {
          const decodedToken = jwt_decode(myToken);
          setFirstName(decodedToken.first_name);
          setLastName(decodedToken.last_name);
          setDecoded(decodedToken);
          setMyToken(myToken);
          const data = await instance.get(`/authvalidation/checkauth`, { headers: { "authorization": `${myToken}` } })
          if(data.data===200){
            console.log('in in inf')
          }
  
        } catch (error) {
          console.log(error.message);
          console.log('Invalid token, please log in again.')
          navigate('/login')
        }
      }else{
        console.log('in toast')
       
        navigate('/login')
      }
  }
  const backToLogin = () => {
    console.log('backToLogin')
    toastError('Token not found, please log in again.')
    navigate('/login')
  }

  useEffect(() => {
    const isToken = localStorage.getItem("token")
    if(isToken!== null){
      checkAuth();
    }else{
      console.log(' in else error')
      backToLogin();
    }
  }, [location]);

  return (
    <div key='uniqueKey'>
      {myRoutes.includes(location.pathname) ? <Navbar /> : null}
      <UserContext.Provider value={{firstName, lastName, myToken, decoded}}>
      <Routes>
        <Route path="/worker" element={<AddWorker />}> </Route>
        <Route path="/reports" element={<Reports />}> </Route>
        <Route path="/home" element={<Home />}></Route>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route path="*" element={<Login />}></Route>
      </Routes>
      </UserContext.Provider>
    </div>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
