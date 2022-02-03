import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

// Components:
import NotificationForFriendRequestPanel from './NotificationForFriendRequestPanel';

// Redux:
import { useSelector } from 'react-redux';

// Custom hooks:
import useFriendRequests from '../customHooks/useFriendRequests';


function TopNavButtonForFriendRequest(props) {
    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [isDisplayed, setIsDisplayed] = useState(false);


    // Methods:
    const handleInputChange_ForFRNBtn = (e) => {
        e.stopPropagation();
        setIsDisplayed(!isDisplayed);
    }


    // Hooks:
    const paramsToGetFriendRequests = useMemo(() => {
        return {
            userID: user.uid,
            limit: 30
        };
    }, [user.uid]);

    // (REALTIME) Get all friend requests that belong to the user.
    const friendRequestNotifications = useFriendRequests('notificationsForFriendRequests', paramsToGetFriendRequests);


    // Component:
    const countNewNotifications = () => {
        let count = 0;
        for (let i = 0; i < friendRequestNotifications.length; i++) {
            // 1. Get number of new requests which this user received:
            if (friendRequestNotifications[i].senderUID !== user.uid
                && friendRequestNotifications[i].receiverSeen === false
            ) {
                count++;
            }
            // 2. Get number of accepted requests were sent by this user:
            if (friendRequestNotifications[i].senderUID === user.uid
                && friendRequestNotifications[i].senderSeen === false
                && friendRequestNotifications[i].state === 'accepted'
            ) {
                count++;
            }
        }
        return count;
    };

    const renderBadge = () => {
        if (countNewNotifications() > 0) {
            return (
                <div className='notification-btn__badge'>
                    <span className='notification-btn__counting-number'>{countNewNotifications()}</span>
                </div>
            );
        } else {
            return (<></>);
        }
    };

    return (
        <div
            className={`menu-item menu-button notification-btn${isDisplayed ? ' active' : ''}`}
            onClick={(e) => handleInputChange_ForFRNBtn(e)}
        >
            <div className='content-wrapper'>
                <FontAwesomeIcon className='menu-button__icon notification-icon' icon={faUserFriends} />
                {renderBadge()}
            </div>
            <div
                className={`overlay--transparent${isDisplayed ? ' visible' : ''}`}
                onClick={(e) => handleInputChange_ForFRNBtn(e)}>
            </div>
            <div
                className='notification-menu'
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className='notification-menu__body'>
                    <div className='notification-menu__notifications'>
                        <NotificationForFriendRequestPanel
                            isFRNMenuDisplayed={isDisplayed}
                            setIsFRNMenuDisplayed={setIsDisplayed}
                            friendRequestNotifications={friendRequestNotifications}
                            numberOfNewNotifications={countNewNotifications()}
                        ></NotificationForFriendRequestPanel>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNavButtonForFriendRequest;