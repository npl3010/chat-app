import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

// Components:
import NotificationForOthersPanel from './NotificationForOthersPanel';

// Redux:
import { useSelector } from 'react-redux';

// Custom hooks:
import useNotifications from '../customHooks/useNotifications';


function TopNavButtonForNotification(props) {
    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [isDisplayed, setIsDisplayed] = useState(false);


    // Methods:
    const handleInputChange_ForONBtn = (e) => {
        e.stopPropagation();
        setIsDisplayed(!isDisplayed);
    }


    // Hooks:
    const paramsToGetNotifications = useMemo(() => {
        return {
            userID: user.uid,
            limit: 30
        };
    }, [user.uid]);

    // (REALTIME) Get all notifications that belong to the user.
    const notifications = useNotifications('notificationsForOthers', paramsToGetNotifications);


    // Component:
    const countNewNotifications = () => {
        let count = 0;
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].isSeenBy.includes(user.uid) === false) {
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
            onClick={(e) => handleInputChange_ForONBtn(e)}
        >
            <div className='content-wrapper'>
                <FontAwesomeIcon className='menu-button__icon notification-icon' icon={faBell} />
                {renderBadge()}
            </div>
            <div
                className={`overlay--transparent${isDisplayed ? ' visible' : ''}`}
                onClick={(e) => handleInputChange_ForONBtn(e)}>
            </div>
            <div
                className='notification-menu'
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className='notification-menu__body'>
                    <div className='notification-menu__notifications'>
                        <NotificationForOthersPanel
                            isONMenuDisplayed={isDisplayed}
                            setIsONMenuDisplayed={setIsDisplayed}
                            notifications={notifications}
                            numberOfNewNotifications={countNewNotifications()}
                        ></NotificationForOthersPanel>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNavButtonForNotification;