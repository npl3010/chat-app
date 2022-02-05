import React, { useEffect, useState } from 'react';

// Components:
import Notification from './Notification';
import NotificationIsEmpty from './NotificationIsEmpty';

// Redux:
import { useSelector } from 'react-redux';

// Services:
import { fetchRoomByRoomID } from '../firebase/queryRooms';
import { markNotificationAsReadByUID } from '../firebase/queryNotifications';
import { formatDateTimeFromDateString } from '../firebase/services';

// CSS:
import '../styles/scss/components/NotificationForOthersPanel.scss';

// Assets:
import groupChatImg from '../assets/images/GroupChat.png';


function NotificationForOthersPanel(props) {
    const {
        notifications,
    } = props;


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [notificationsData, setNotificationsData] = useState([]);


    // Side effects:
    useEffect(() => {
        const result = [];
        if (notifications.length > 0) {
            notifications.forEach((ntf, index) => {
                // 1. Generate many types of notification below: 
                // - Notification for the user who is added to a group chat.

                // 2. Generate notification data:
                if (ntf.objectType === 'group-chat') {
                    fetchRoomByRoomID(ntf.objectID)
                        .then((roomData) => {
                            if (roomData) {
                                result.push({
                                    ...ntf,
                                    objectName: roomData.name
                                });
                            }
                            if (index === notifications.length - 1) {
                                setNotificationsData([...result]);
                            }
                        });
                }
            });
        } else {
            setNotificationsData([...result]);
        }
        return result;
    }, [user.uid, notifications]);


    // Component:
    const renderNotifications = () => {
        if (notificationsData.length > 0) {
            return (
                <>
                    {
                        notificationsData.map((nData, index) => {
                            const date = new Date(nData.createdAt.toDate().toString());
                            const relativeDateTime = formatDateTimeFromDateString(date);
                            if (nData.type === 'be-added-to-a-group-chat') {
                                return (
                                    <Notification
                                        key={`notification-${index}`}
                                        objectName={nData.objectName}
                                        objectImgSrc={groupChatImg}
                                        createdAt={relativeDateTime}
                                        isHighlighted={!(nData.isSeenBy.includes(user.uid))}
                                        label='Nhóm chat mới'
                                        textBeforeObjectName='Bạn được thêm vào nhóm chat'
                                        hasActions={false}
                                        handleOnClick={() => markNotificationAsReadByUID(nData.id, user.uid)}
                                    ></Notification>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </>
            );
        }
        return (
            <NotificationIsEmpty
                title='Không có thông báo để hiển thị!'
            ></NotificationIsEmpty>
        );
    };

    return (
        <div className='notification-list-wrapper for-topnav for-other-notifications'>
            <div className='notification-list'>
                {renderNotifications()}
            </div>
        </div>
    );
}

export default NotificationForOthersPanel;