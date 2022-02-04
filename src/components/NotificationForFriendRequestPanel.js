import React, { useEffect, useRef, useState } from 'react';

// Components:
import NotificationForFriendRequest from './NotificationForFriendRequest';
import NotificationForNewFriend from './NotificationForNewFriend';
import NotificationIsEmpty from './NotificationIsEmpty';

// Redux:
import { useSelector } from 'react-redux';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// Services:
import { fetchUserListByUserID } from '../firebase/queryUsers';
import { markAllNotificationsAsReadByUID } from '../firebase/queryFriends';
import { formatDateTimeFromDateString } from '../firebase/services';

// CSS:
import '../styles/scss/components/NotificationForFriendRequestPanel.scss';

// Assets:
import emptyFriendRequestsImg from '../assets/images/WhatMakesYouSad.jpg';


function NotificationForFriendRequestPanel(props) {
    const {
        isFRNMenuDisplayed,
        setIsFRNMenuDisplayed,
        friendRequestNotifications,
        numberOfNewNotifications
    } = props;
    const timeout = useRef(null);


    // Context:
    const {
        isModalSearchUserVisible, setIsModalSearchUserVisible
    } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [notificationsData, setNotificationsData] = useState([]);


    // Side effects:
    useEffect(() => {
        clearTimeout(timeout.current);
        // Mark all notifications as read:
        if (isFRNMenuDisplayed === true && notificationsData.length > 0) {
            if (numberOfNewNotifications > 0) {
                timeout.current = setTimeout(() => {
                    markAllNotificationsAsReadByUID(user.uid);
                }, 3000);
            }
        }
    }, [isFRNMenuDisplayed, notificationsData.length, numberOfNewNotifications, user.uid]);

    useEffect(() => {
        const result = [];
        if (friendRequestNotifications.length > 0) {
            friendRequestNotifications.forEach((fRequest, index) => {
                // 1. Generate two types of notification below: 
                // - The accepted requests were sent by this user.
                // - The requests which this user received.

                // 2. Get second person's uid to generate the notification:
                const notificationAboutUID = (user.uid !== fRequest.senderUID) ? fRequest.senderUID : fRequest.receiverUID;

                // 3. Generate notification data:
                fetchUserListByUserID(notificationAboutUID)
                    .then((userData) => {
                        const date = new Date(fRequest.createdAt);
                        result.push({
                            sentAt: formatDateTimeFromDateString(date.toString()),
                            fromUID: fRequest.senderUID,
                            toUID: fRequest.receiverUID,
                            displayName: userData[0].displayName,
                            email: userData[0].email,
                            photoURL: userData[0].photoURL,
                            uid: userData[0].uid,
                            unread: (user.uid === fRequest.senderUID) ? (!fRequest.senderSeen) : (!fRequest.receiverSeen),
                            state: fRequest.state
                        });
                        if (index === friendRequestNotifications.length - 1) {
                            setNotificationsData([...result]);
                        }
                    });
            });
        } else {
            setNotificationsData([...result]);
        }
        return result;
    }, [user.uid, friendRequestNotifications]);


    // Methods:
    const handleClickSearchFriends = () => {
        setIsFRNMenuDisplayed(!isFRNMenuDisplayed);
        setIsModalSearchUserVisible(!isModalSearchUserVisible);
    };


    // Component:
    const renderNotificationForFriendRequests = () => {
        let countNotifications = 0;
        if (notificationsData.length > 0) {
            return (
                <>
                    {
                        notificationsData.map((nData, index) => {
                            if (nData.fromUID !== user.uid && nData.state === 'pending') {
                                countNotifications++;
                                return (
                                    <NotificationForFriendRequest
                                        requestFrom={nData.fromUID}
                                        requestTo={nData.toUID}
                                        key={`notification-${index}`}
                                        userName={nData.displayName}
                                        userImgSrc={nData.photoURL}
                                        objectSentAt={nData.sentAt}
                                        unread={nData.unread}
                                    ></NotificationForFriendRequest>
                                );
                            } else if (nData.state === 'accepted') {
                                countNotifications++;
                                return (
                                    <NotificationForNewFriend
                                        requestFrom={nData.fromUID}
                                        requestTo={nData.toUID}
                                        key={`notification-${index}`}
                                        userName={nData.displayName}
                                        userImgSrc={nData.photoURL}
                                        objectSentAt={nData.sentAt}
                                        unread={nData.unread}
                                    ></NotificationForNewFriend>
                                )
                            } else {
                                if (index === (notificationsData.length - 1) && countNotifications === 0) {
                                    return (
                                        <NotificationIsEmpty
                                            key={`notification-for-empty-results`}
                                            hasSingleAction={true}
                                            actionNameForOK='Thêm bạn'
                                            title='Bạn chưa có lời mời kết bạn nào!'
                                            onOK={handleClickSearchFriends}
                                            img={emptyFriendRequestsImg}
                                        ></NotificationIsEmpty>
                                    );
                                }
                                return (null);
                            }
                        })
                    }
                </>
            );
        } else {
            return (
                <NotificationIsEmpty
                    hasSingleAction={true}
                    actionNameForOK='Thêm bạn'
                    title='Bạn chưa có lời mời kết bạn nào!'
                    onOK={handleClickSearchFriends}
                    img={emptyFriendRequestsImg}
                ></NotificationIsEmpty>
            );
        }
    };

    return (
        <div className='notification-list-wrapper for-topnav for-friend-request'>
            <div className='notification-list'>
                {renderNotificationForFriendRequests()}
            </div>
        </div>
    );
}

export default NotificationForFriendRequestPanel;