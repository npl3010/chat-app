import React, { useMemo } from 'react';

// Components:
import NotificationForFriendRequest from './NotificationForFriendRequest';
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
        setIsFRNMenuDisplayed
    } = props;


    // Context:
    const user = useSelector((state) => state.userAuth.user);
    const {
        isModalSearchUserVisible, setIsModalSearchUserVisible
    } = React.useContext(ModalControlContext);


    // Redux:
    const {
        friendRequestsReceived,
        friendRequestsReceivedAt,
        friendRequestsReceivedIsSeen,
    } = useSelector((state) => state.manageFriends);


    // Hooks:
    const friendRequestsData = useMemo(() => {
        const result = [];
        if (friendRequestsReceived.length > 0) {
            friendRequestsReceived.forEach((fRequestFromUID, index) => {
                fetchUserListByUserID(fRequestFromUID)
                    .then((userData) => {
                        const date = new Date(friendRequestsReceivedAt[index]);
                        result.push({
                            fromUID: fRequestFromUID,
                            toUID: user.uid,
                            displayName: userData[0].displayName,
                            email: userData[0].email,
                            photoURL: userData[0].photoURL,
                            uid: userData[0].uid,
                            sentAt: date.toString()
                        });
                    });
            });
        }
        return result;
    }, [user.uid, friendRequestsReceived, friendRequestsReceivedAt]);


    // Methods:
    const handleClickSearchFriends = () => {
        setIsFRNMenuDisplayed(!isFRNMenuDisplayed);
        setIsModalSearchUserVisible(!isModalSearchUserVisible);
    };


    // Component:
    const renderNotificationForFriendRequests = () => {
        if (friendRequestsData.length > 0) {
            return (
                <>
                    {
                        friendRequestsData.slice(0).reverse().map((data, index) => {
                            return (
                                <NotificationForFriendRequest
                                    requestFrom={data.fromUID}
                                    requestTo={data.toUID}
                                    key={`notification-${index}`}
                                    userName={data.displayName}
                                    userImgSrc={data.photoURL}
                                    objectSentAt={data.sentAt}
                                    unread={friendRequestsReceivedIsSeen <= index ? true : false}
                                ></NotificationForFriendRequest>
                            );
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