import React from 'react';

// Components:
import Notification from './Notification';

// CSS:
import '../styles/scss/components/NotificationForFriendRequest.scss';


function NotificationForFriendRequest(props) {
    const {
        userName,
        userImgSrc,
        objectSentAt,
        unread
    } = props;


    // Methods:
    const handleOnOK = () => {
        console.log('OK!');
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
            onOK={handleOnOK}
            onCancel={handleOnCancel}
        ></Notification>
    );
}

export default NotificationForFriendRequest;