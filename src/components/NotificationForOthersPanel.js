import React from 'react';

// Components:
import NotificationIsEmpty from './NotificationIsEmpty';

// CSS:
import '../styles/scss/components/NotificationForOthersPanel.scss';


function NotificationForOthersPanel(props) {
    // Component:
    const renderNotifications = () => {
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