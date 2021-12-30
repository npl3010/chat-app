import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCaretDown } from '@fortawesome/free-solid-svg-icons';

// Firebase:
import { auth, signOut } from '../firebase/config';

// Redux:
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/userAuthSlice';

// CSS:
import '../styles/scss/components/TopNavigation.scss';

// Custom hooks:
// import useFirestore from '../customHooks/useFirestore';


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


    // Side effects:
    useEffect(() => {
        // (Cloud Firestore) Listen for realtime updates:
        // onSnapshot(
        //     collection(db, "users"),
        //     (snapshot) => {
        //         const data = snapshot.docs.map((doc) => {
        //             return ({
        //                 ...doc.data(),
        //                 id: doc.id
        //             });
        //         });
        //         console.log(data)
        //     });
    }, []);


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
                            <div className='menu-item user-btn'>
                                <div className='user-img-wrapper'>
                                    <img className='user-img' src={user.photoURL} alt='' ></img>
                                </div>
                                <div className='user-name'>
                                    {user !== null ? `${user.displayName}` : 'Unknown'}
                                </div>
                            </div>

                            <div className='menu-item menu-button notification-btn'>
                                <FontAwesomeIcon className='menu-button__icon notification-icon' icon={faBell} />
                            </div>

                            <label className='menu-item menu-button dropdown-btn' htmlFor="checkbox-for-dropdown-menu">
                                <FontAwesomeIcon className='menu-button__icon dropdown-icon' icon={faCaretDown} />
                                <input
                                    id="checkbox-for-dropdown-menu"
                                    type="checkbox"
                                    name="dropdown-menu-is-displayed">
                                </input>
                                <div className='dropdown-menu'>
                                    <button onClick={() => handleLogout()}>LOG OUT!</button>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNavigation;