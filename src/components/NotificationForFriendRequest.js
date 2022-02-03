import React, { useState } from 'react';

// Components:
import Notification from './Notification';

// Context:
import { AlertControlContext } from '../context/AlertControlProvider';

// Services:
import { acceptFriendRequest, cancelFriendRequestSent } from '../firebase/queryFriends';

// CSS:
import '../styles/scss/components/NotificationForFriendRequest.scss';


function NotificationForFriendRequest(props) {
    const {
        requestFrom,
        requestTo,
        userName,
        userImgSrc,
        objectSentAt,
        unread = false
    } = props;


    // Context:
    const {
        showAppAlertMessage
    } = React.useContext(AlertControlContext);


    // State:
    // Values for loadingStateFor: "action-OK", "action-Cancel", "".
    const [loadingStateFor, setLoadingStateFor] = useState('');


    // Methods:
    const handleAcceptFriendRequest = () => {
        if (typeof requestFrom === 'string' && typeof requestTo === 'string') {
            if (requestFrom.length > 0 && requestTo.length > 0) {
                setLoadingStateFor('action-OK');
                acceptFriendRequest(requestFrom, requestTo)
                    .then((res) => {
                        if (res === true) {
                            // setLoadingStateFor('');
                        }
                    });
            }
        }
    };

    const handleCancelFriendRequestReceived = () => {
        if (typeof requestFrom === 'string' && typeof requestTo === 'string') {
            if (requestFrom.length > 0 && requestTo.length > 0) {
                setLoadingStateFor('action-Cancel');
                cancelFriendRequestSent(requestFrom, requestTo)
                    .then((res) => {
                        if (res === true) {
                            // setLoadingStateFor('');
                            showAppAlertMessage('', 'Thông báo', `Đã xóa lời mời kết bạn của ${userName}.`, 5);
                        }
                    });
            }
        }
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
            onCancel={handleCancelFriendRequestReceived}
            loadingStateFor={loadingStateFor}
        ></Notification>
    );
}

export default NotificationForFriendRequest;