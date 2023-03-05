import { Navigate, Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Switch } from "react-router-dom";
import Home from './Home';
import Reports from './Reports';
import AddWorker from './AddWorker';
import Navbar from './Navbar';
import Login from './Login';
// import instance from './api/connection';
const useAuth = () => {
  const user = { loggedIn: false };
  return user && user.loggedIn;
};

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  console.log('in token')
  if (token) {
    return (
      <Routes>
        <Route path="/worker" element={<AddWorker />}> </Route>
        <Route path="/reports" element={<Reports />}> </Route>
        <Route path="/home" element={<Home />}></Route>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route path="*" element={<Login />}></Route>
      </Routes>
    )

  } else {
    return <Navigate to="/" />
  }

  // const isAuth = useAuth();
};

export default ProtectedRoutes;