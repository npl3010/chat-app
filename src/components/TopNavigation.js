import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

// Firebase:
import { auth, signOut } from '../firebase/config';

// Redux:
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/userAuthSlice';

// CSS:
import '../styles/scss/components/TopNavigation.scss';


function TopNavigation(props) {
    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const dispatch = useDispatch();


    // Methods:
    const handleLogout = () => {
        signOut(auth)
            .then((result) => {
                // Sign-out successful!
                const action = setUser(null);
                dispatch(action);
            })
            .catch((error) => {
                // An error happened!
            });
    }


    // Component:
    return (
        <div className='top-navigation'>
            <div className='topnav-wrapper'>
                <div className='topnav'>
                    <div className='topnav__left-section'>
                        <div className='quick-menu'>
                            <span className='logo'>chat</span>
                            <input type='text' placeholder='Tìm kiếm trên app'></input>
                        </div>
                    </div>
                    <div className='topnav__mid-section'>
                        <div className='app-menu'>
                        </div>
                    </div>
                    <div className='topnav__right-section'>
                        <div className='personal-menu'>
                            {user !== null ? `Hello, ${user.displayName}` : ''}
                            <FontAwesomeIcon icon={faBell} />
                            <button onClick={() => handleLogout()}>LOG OUT!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNavigation;