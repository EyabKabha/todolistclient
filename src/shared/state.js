import jwt_decode from "jwt-decode";
let my_data = {};
if (localStorage.getItem("token") === null || localStorage.getItem("token") === undefined) {
    
} else {
    const myToken = localStorage.getItem('token')
    var decoded = jwt_decode(myToken);
   
    my_data = {
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
    }
}

export const myData = Object.assign(window.my_data, window.my_data)
console.log(window.my_data)