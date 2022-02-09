import React from 'react';
// import swal from 'sweetalert';

// Components:
import TextWithEffect from '../components/text/TextWithEffect';

// Firebase:
import { auth, signInWithPopup, fb_provider, getAdditionalUserInfo } from '../firebase/config';

// Redux:
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/userAuthSlice';

// Context:
import { AlertControlContext } from '../context/AlertControlProvider';

// Services:
import { addDocument, addDocumentWithoutTimestamp, generateUserNameKeywords } from '../firebase/services';

// CSS:
import '../styles/scss/pages/LoginPage.scss';


function LoginPage(props) {
    // Context:
    const {
        showAppAlertMessage
    } = React.useContext(AlertControlContext);


    // Redux:
    const dispatch = useDispatch();


    // Methods:
    const handleLoginWithFB = () => {
        signInWithPopup(auth, fb_provider)
            .then((result) => {
                // Get user data:
                const { displayName, email, uid, photoURL } = result.user;
                const action = setUser({ displayName, email, uid, photoURL });
                dispatch(action);

                // Check isNewUser:
                const moreInfo = getAdditionalUserInfo(result);
                if (moreInfo.isNewUser === true) {
                    // If user's account is the first login, create necessary tables in database:
                    // - Table 'users':
                    addDocument("users", {
                        displayName: result.user.displayName,
                        email: result.user.email,
                        uid: result.user.uid,
                        photoURL: result.user.photoURL,
                        providerId: moreInfo.providerId,
                        displayNameSearchKeywords: generateUserNameKeywords(result.user.displayName),
                        phoneNumber: result.user.phoneNumber,
                        gender: ''
                    });
                    // - Table 'friends':
                    addDocumentWithoutTimestamp("friends", {
                        uid: result.user.uid,
                        friends: [],
                        friendsFrom: []
                    });
                }

                // Display result:
                // swal("Successfully logged in!", `Your email: ${email}`, "success");
                showAppAlertMessage('success', 'Đăng nhập thành công', `Tài khoản: ${email}`, 3);
            })
            .catch((error) => {
                // Handle Errors:
                const errorCode = error.code;
                const errorMessage = error.message;
                // Display result:
                // swal(errorCode, errorMessage, "error");
                showAppAlertMessage('danger', errorCode, errorMessage, 5);
            });
    }


    // Component:
    return (
        <div className='app-page-wrapper'>
            <div className='app-page'>
                <div className='loginpage-wrapper'>
                    <div className='loginpage'>
                        {/* Header: */}
                        <div className='loginpage__header-section'></div>

                        {/* Intro: */}
                        <div className='loginpage__intro-section'>
                            <div className='color-block'></div>
                            <div className='color-block'></div>
                            <div className='color-block'></div>
                            {/* Introduction: */}
                            <div className='intro-section'>
                                <div className='intro-section__left-section'>
                                    <div className='intro-wrapper'>
                                        <div className='intro'>
                                            <div className='intro__title'>
                                                <TextWithEffect text="MyChatApp" textType={['white-text']}></TextWithEffect>
                                            </div>
                                            <div className='intro__content'>
                                                <div className='content-wrapper'>
                                                    <div className='content'>Connect with people</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='intro-section__right-section'>
                                    <div className='login-form-wrapper'>
                                        <div className='square-block' style={{ '--order': 1 }}></div>
                                        <div className='square-block' style={{ '--order': 2 }}></div>
                                        {/* Login form: */}
                                        <div className='login-form'>
                                            <div className='login-form__header'>
                                                <div className='form-title'>Login Form</div>
                                            </div>
                                            <div className='login-form__fields'>
                                                <div className='other-sign-in-options'>
                                                    <button
                                                        className='sign-in-option login-btn with-facebook'
                                                        onClick={() => handleLoginWithFB()}
                                                    >Đăng nhập với tài khoản Facebook</button>
                                                    <button
                                                        className='sign-in-option login-btn with-google'
                                                        onClick={() => handleLoginWithFB()}
                                                    >Đăng nhập với tài khoản Google</button>
                                                </div>
                                            </div>
                                            <div className='login-form__footer'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About: */}
                        <div className='loginpage__about-section'></div>

                        {/* Footer: */}
                        <div className='loginpage__footer-section'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;