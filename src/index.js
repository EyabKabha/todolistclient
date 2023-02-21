import React, {  useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from './components/Home';
import Reports from './components/Reports';
import AddWorker from './components/AddWorker';
import Navbar from './components/Navbar';
import Login from './components/Login';
import instance from './api/connection';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation()
  const myRoutes = ['/worker', '/reports', '/home']

  
  const checkAuth = async () => {
    try {
      const myToken = localStorage.getItem("token");
      const data = await instance.get(`/authvalidation/checkauth`, { headers: { "authorization": `${myToken}` } });
    } catch (error) { 
      localStorage.clear()
      navigate('/login')
    }
  }

  useEffect(() => {
    const getToken = localStorage.getItem('token');
    if (getToken!== null) {
      checkAuth();
    }
  });

  return (
    <div key='uniqueKey'>
      {myRoutes.includes(location.pathname) ? <Navbar /> : null}
      <Routes>
        <Route path="/worker" element={<AddWorker />}> </Route>
        <Route path="/reports" element={<Reports />}> </Route>
        <Route path="/home" element={<Home />}></Route>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route path="*" element={<Login />}></Route>
      </Routes>
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
