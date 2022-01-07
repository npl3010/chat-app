import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';

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
    // State:
    const [isDropdownMenuDisplayed, setIsDropdownMenuDisplayed] = useState(false);


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

    const handleInputChange_ForDropdownBtn = (e) => {
        e.stopPropagation();
        setIsDropdownMenuDisplayed(!isDropdownMenuDisplayed);
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
                        <div className='topnav__quick-menu'>
                            <span className='topnav__logo'>MyChatApp</span>
                            <div className='search-box-wrapper'>
                                <div className='search-box--primary'>
                                    <FontAwesomeIcon className='search-box__icon' icon={faSearch} />
                                    <input className='search-box__input' type='text' placeholder='Tìm kiếm trên App'></input>
                                </div>
                            </div>
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

                            <div
                                className='menu-item menu-button dropdown-btn'
                                onClick={(e) => handleInputChange_ForDropdownBtn(e)}
                            >
                                <FontAwesomeIcon className='menu-button__icon dropdown-icon' icon={faCaretDown} />
                                <input
                                    id="checkbox-for-dropdown-menu"
                                    type="checkbox"
                                    name="dropdown-menu-is-displayed"
                                    checked={isDropdownMenuDisplayed}
                                    onChange={(e) => { handleInputChange_ForDropdownBtn(e) }}
                                >
                                </input>
                                <div
                                    className={`overlay--transparent${isDropdownMenuDisplayed ? ' visible' : ''}`}
                                    onClick={(e) => handleInputChange_ForDropdownBtn(e)}>
                                </div>
                                <div
                                    className='dropdown-menu'
                                    onClick={(e) => { e.stopPropagation() }}
                                >
                                    <button onClick={() => handleLogout()}>LOG OUT!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNavigation;