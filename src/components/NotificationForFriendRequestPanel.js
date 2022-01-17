import React, { useMemo } from 'react';

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

// CSS:
import '../styles/scss/components/NotificationForFriendRequestPanel.scss';

// Assets:
import emptyFriendRequestsImg from '../assets/images/WhatMakesYouSad.jpg';


function NotificationForFriendRequestPanel(props) {
    const {
        isFRNMenuDisplayed,
        setIsFRNMenuDisplayed,
        friendRequestNotifications
    } = props;


    // Context:
    const {
        isModalSearchUserVisible, setIsModalSearchUserVisible
    } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    // const [friendRequestsData, setFriendRequestsData] = useState([]);


    // Side effects:
    const friendRequestsData = useMemo(() => {
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
                            sentAt: date.toString(),
                            fromUID: fRequest.senderUID,
                            toUID: fRequest.receiverUID,
                            displayName: userData[0].displayName,
                            email: userData[0].email,
                            photoURL: userData[0].photoURL,
                            uid: userData[0].uid,
                            unread: (user.uid === fRequest.senderUID) ? (!fRequest.senderSeen) : (!fRequest.receiverSeen),
                            state: fRequest.state
                        });
                    });
            });
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
        if (friendRequestsData.length > 0) {
            return (
                <>
                    {
                        friendRequestsData.map((data, index) => {
                            if (data.fromUID !== user.uid && data.state === 'pending') {
                                countNotifications++;
                                return (
                                    <NotificationForFriendRequest
                                        requestFrom={data.fromUID}
                                        requestTo={data.toUID}
                                        key={`notification-${index}`}
                                        userName={data.displayName}
                                        userImgSrc={data.photoURL}
                                        objectSentAt={data.sentAt}
                                        unread={data.unread}
                                    ></NotificationForFriendRequest>
                                );
                            } else if (data.state === 'accepted') {
                                countNotifications++;
                                return (
                                    <NotificationForNewFriend
                                        requestFrom={data.fromUID}
                                        requestTo={data.toUID}
                                        key={`notification-${index}`}
                                        userName={data.displayName}
                                        userImgSrc={data.photoURL}
                                        objectSentAt={data.sentAt}
                                        unread={data.unread}
                                    ></NotificationForNewFriend>
                                )
                            } else {
                                if (index === friendRequestsData.length - 1 && countNotifications === 0) {
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