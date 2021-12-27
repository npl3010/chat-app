import React from 'react';
import swal from 'sweetalert';

// Firebase:
import { auth, signInWithPopup, fb_provider } from '../firebase/config';

// Redux:
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/userAuthSlice';


function LoginPage(props) {
    // Redux:
    const dispatch = useDispatch();


    // Methods:
    const handleLoginWithFB = () => {
        signInWithPopup(auth, fb_provider)
            .then((result) => {
                const { displayName, email, uid, photoURL } = result.user;
                const action = setUser({ displayName, email, uid, photoURL });
                dispatch(action);
                // Display result:
                swal("Successfully logged in!", `Your email: ${email}`, "success");
            })
            .catch((error) => {
                // Handle Errors:
                const errorCode = error.code;
                const errorMessage = error.message;
                // Display result:
                swal(errorCode, errorMessage, "error");
            });
    }


    // Component:
    return (
        <div>
            <button onClick={() => handleLoginWithFB()}>Đăng nhập với tài khoản Facebook</button>
            <button>Đăng nhập với tài khoản Google</button>
        </div>
    );
}

export default LoginPage;