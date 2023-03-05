const deleteAuth = () =>{
    localStorage.removeItem('token');
}

const authService = {
    deleteAuth,
}

export default authService;