import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

// Components:
import TopNavButtonForFriendRequest from './TopNavButtonForFriendRequest';
import TopNavButtonForNotification from './TopNavButtonForNotification';
import OptionListMenu from './OptionListMenu';
import TextWithEffect from './text/TextWithEffect';

// Firebase:
import { auth, signOut } from '../firebase/config';

// Redux:
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/userAuthSlice';

// CSS:
import '../styles/scss/components/TopNavigation.scss';

// Assets:
import appLogo from '../assets/images/AppLogo.png';


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


    // Component:
    return (
        <div className='top-navigation'>
            <div className='topnav-wrapper'>
                <div className='topnav'>
                    <div className='topnav__left-section'>
                        <div className='topnav__quick-menu'>
                            <span className='topnav__logo'>
                                <span className='logo-wrapper'>
                                    <img className='logo' src={appLogo} alt='' draggable={false}></img>
                                </span>
                            </span>
                            <span className='topnav__app-name'>
                                <TextWithEffect text="MyChatApp"></TextWithEffect>
                            </span>
                            {/* <div className='search-box-wrapper'>
                                <div className='search-box--primary'>
                                    <FontAwesomeIcon className='search-box__icon' icon={faSearch} />
                                    <input className='search-box__input' type='text' placeholder='Tìm kiếm trên App'></input>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    <div className='topnav__mid-section'>
                        <div className='app-menu'>
                        </div>
                    </div>

                    <div className='topnav__right-section'>
                        <div className='main-menu'>
                            {/* Logged in user: */}
                            <div className='menu-item user-btn'>
                                <div className='user-img-wrapper'>
                                    <img className='user-img' src={user.photoURL} alt='' ></img>
                                </div>
                                <div className='user-name'>
                                    {user !== null ? `${user.displayName}` : 'Unknown'}
                                </div>
                            </div>

                            {/* Button for Friend Request Notifications: */}
                            <TopNavButtonForFriendRequest
                            ></TopNavButtonForFriendRequest>

                            {/* Button for Other Notifications: */}
                            <TopNavButtonForNotification
                            ></TopNavButtonForNotification>

                            {/* More settings: */}
                            <div
                                className={`menu-item menu-button dropdown-btn${isDropdownMenuDisplayed ? ' active' : ''}`}
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
                                    <div className='dropdown-menu__header'>
                                    </div>
                                    <div className='dropdown-menu__body'>
                                        <div className='dropdown-menu__options'>
                                            <OptionListMenu handleLogout={handleLogout}></OptionListMenu>
                                        </div>
                                    </div>
                                    <div className='dropdown-menu__footer'>
                                        <div className='dropdown-menu__title'>Facebook Messenger Clone</div>
                                        <div className='dropdown-menu__label'>View source on GitHub:</div>
                                        <a
                                            className='dropdown-menu__link'
                                            href='https://github.com/npl3010/chat-app'
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <span>github.com/npl3010/chat-app</span>
                                        </a>
                                    </div>
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