import React from 'react';

// Components:
import Notification from './Notification';

// Services:
import { acceptFriendRequest } from '../firebase/queryFriends';

// CSS:
import '../styles/scss/components/NotificationForFriendRequest.scss';


function NotificationForFriendRequest(props) {
    const {
        requestFrom,
        requestTo,
        userName,
        userImgSrc,
        objectSentAt,
        unread
    } = props;


    // Methods:
    const handleAcceptFriendRequest = () => {
        if (typeof requestFrom === 'string' && typeof requestTo === 'string') {
            if (requestFrom.length > 0 && requestTo.length > 0) {
                acceptFriendRequest(requestFrom, requestTo);
            }
        }
    };

    const handleOnCancel = () => {
        console.log('Cancel!');
    };


    // Component:
    return (
        <Notification
            className='for-friend-request'
            label='Lời mời kết bạn'
            objectName={userName}
            objectImgSrc={userImgSrc}
            textAfterObjectName='đã gửi cho bạn một lời mời kết bạn.'
            isHighlighted={unread}
            createdAt={objectSentAt}
            hasActions={true}
            actionNameForOK='Chấp nhận'
            actionNameForCancel='Từ chối'
            onOK={handleAcceptFriendRequest}
            onCancel={handleOnCancel}
        ></Notification>
    );
}

export default NotificationForFriendRequest;