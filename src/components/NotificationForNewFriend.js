import React from 'react';

// Components:
import Notification from './Notification';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/NotificationForNewFriend.scss';


function NotificationForNewFriend(props) {
    const {
        requestFrom,
        requestTo,
        userName,
        userImgSrc,
        objectSentAt,
        unread
    } = props;


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // Component:
    const renderParagraph = () => {
        if (user.uid === requestFrom) {
            return 'đã chấp nhận lời mời kết bạn của bạn.';
        } else if (user.uid === requestTo) {
            return 'đã trở thành bạn bè với bạn.';
        } else {
            return '';
        }
    };

    return (
        <Notification
            className='for-new-friend'
            label='Bạn bè mới'
            objectName={userName}
            objectImgSrc={userImgSrc}
            textAfterObjectName={renderParagraph()}
            isHighlighted={unread}
            createdAt={objectSentAt}
            hasActions={false}
        ></Notification>
    );
}

export default NotificationForNewFriend;