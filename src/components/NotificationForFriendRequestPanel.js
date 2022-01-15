import React, { useMemo } from 'react';

// Components:
import NotificationForFriendRequest from './NotificationForFriendRequest';

// Redux:
import { useSelector } from 'react-redux';

// Services:
import { fetchUserListByUserID } from '../firebase/queryUsers';

// CSS:
import '../styles/scss/components/NotificationForFriendRequestPanel.scss';


function NotificationForFriendRequestPanel(props) {
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
    }, [friendRequestsReceived, friendRequestsReceivedAt]);


    // Component:
    const renderNotificationForFriendRequests = () => {
        return (
            <>
                {
                    friendRequestsData.map((data, index) => {
                        return (
                            <NotificationForFriendRequest
                                key={`notification-${index}`}
                                userName={data.displayName}
                                userImgSrc={data.photoURL}
                                objectSentAt={data.sentAt}
                                unread={friendRequestsReceivedIsSeen >= index ? true : false}
                            ></NotificationForFriendRequest>
                        );
                    })
                }
            </>
        );
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