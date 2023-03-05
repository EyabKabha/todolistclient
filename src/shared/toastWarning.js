import { ToastContainer, toast } from "react-toastify";

const toastWarning = (message) => {
    toast.warn(`${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    });
    return (
        <div>
            <ToastContainer />
        </div>
    )
}

const toastSuccess = (message) => {
    toast.success(`${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    });
    return (
        <div>
            <ToastContainer />
        </div>
    )
}

const toastError = (message) => {
    toast.error(`${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    });
    return (
        <div>
            <ToastContainer />
        </div>
    )
}

export { toastWarning, toastSuccess ,toastError}