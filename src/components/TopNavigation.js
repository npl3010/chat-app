import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faCaretDown, faSearch, faUserFriends
} from '@fortawesome/free-solid-svg-icons';

// Components:
import NotificationForFriendRequestPanel from './NotificationForFriendRequestPanel';
import NotificationForOthersPanel from './NotificationForOthersPanel';
import OptionListMenu from './OptionListMenu';

// Firebase:
import { auth, signOut } from '../firebase/config';

// Redux:
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/auth/userAuthSlice';

// CSS:
import '../styles/scss/components/TopNavigation.scss';


function TopNavigation(props) {
    // State:
    const [isDropdownMenuDisplayed, setIsDropdownMenuDisplayed] = useState(false);
    const [isFRNMenuDisplayed, setIsFRNMenuDisplayed] = useState(false);
    const [isONMenuDisplayed, setIsONMenuDisplayed] = useState(false);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const {
        friendRequestsReceived,
        friendRequestsReceivedIsSeen
    } = useSelector((state) => state.manageFriends);
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

    const handleInputChange_ForFRNBtn = (e) => {
        e.stopPropagation();
        setIsFRNMenuDisplayed(!isFRNMenuDisplayed);
    }

    const handleInputChange_ForONBtn = (e) => {
        e.stopPropagation();
        setIsONMenuDisplayed(!isONMenuDisplayed);
    }


    // Component:
    const countNewFriendRequestsReceived = () => {
        return friendRequestsReceived.length - friendRequestsReceivedIsSeen;
    };

    const renderFRNBadge = () => {
        if (countNewFriendRequestsReceived() > 0) {
            return (
                <div className='notification-btn__badge'>
                    <span className='notification-btn__counting-number'>{countNewFriendRequestsReceived()}</span>
                </div>
            );
        } else {
            return (<></>);
        }
    };

    return (
        <div className='top-navigation'>
            <div className='topnav-wrapper'>
                <div className='topnav'>
                    <div className='topnav__left-section'>
                        <div className='topnav__quick-menu'>
                            <span className='topnav__logo'>FMc</span>
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

                            {/* Friend Request Notifications (FRNMenu): */}
                            <div
                                className={`menu-item menu-button notification-btn${isFRNMenuDisplayed ? ' active' : ''}`}
                                onClick={(e) => handleInputChange_ForFRNBtn(e)}
                            >
                                <div className='content-wrapper'>
                                    <FontAwesomeIcon className='menu-button__icon notification-icon' icon={faUserFriends} />
                                    {renderFRNBadge()}
                                </div>
                                <div
                                    className={`overlay--transparent${isFRNMenuDisplayed ? ' visible' : ''}`}
                                    onClick={(e) => handleInputChange_ForFRNBtn(e)}>
                                </div>
                                <div
                                    className='notification-menu'
                                    onClick={(e) => { e.stopPropagation() }}
                                >
                                    <div className='notification-menu__body'>
                                        <div className='notification-menu__notifications'>
                                            <NotificationForFriendRequestPanel
                                                isFRNMenuDisplayed={isFRNMenuDisplayed}
                                                setIsFRNMenuDisplayed={setIsFRNMenuDisplayed}
                                            ></NotificationForFriendRequestPanel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Other Notifications (ONMenu): */}
                            <div
                                className={`menu-item menu-button notification-btn${isONMenuDisplayed ? ' active' : ''}`}
                                onClick={(e) => handleInputChange_ForONBtn(e)}
                            >
                                <div className='content-wrapper'>
                                    <FontAwesomeIcon className='menu-button__icon notification-icon' icon={faBell} />
                                </div>
                                <div
                                    className={`overlay--transparent${isONMenuDisplayed ? ' visible' : ''}`}
                                    onClick={(e) => handleInputChange_ForONBtn(e)}>
                                </div>
                                <div
                                    className='notification-menu'
                                    onClick={(e) => { e.stopPropagation() }}
                                >
                                    <div className='notification-menu__body'>
                                        <div className='notification-menu__notifications'>
                                            <NotificationForOthersPanel
                                                isONMenuDisplayed={isONMenuDisplayed}
                                                setIsONMenuDisplayed={setIsONMenuDisplayed}
                                            ></NotificationForOthersPanel>
                                        </div>
                                    </div>
                                </div>
                            </div>

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