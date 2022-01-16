import React from 'react';

// CSS:
import '../styles/scss/components/NotificationIsEmpty.scss';

// Assets:
import emptyBoxImg from '../assets/images/Pngtree_EmptyBox_2.jpg';


function NotificationIsEmpty(props) {
    const {
        title,
        hasActions = false,
        hasSingleAction = false,
        actionNameForOK = '',
        actionNameForCancel = '',
        img = null,
        onOK = () => { },
        onCancel = () => { }
    } = props;


    // Component:
    const renderActionsIfTheyExist = () => {
        if (hasActions === true) {
            return (
                <div className='empty-notification-actions'>
                    <div className='empty-notification-action-wrapper'>
                        <div
                            className='empty-notification-action'
                            onClick={() => onOK()}
                        >
                            {actionNameForOK ? actionNameForOK : 'OK'}
                        </div>
                        <div
                            className='empty-notification-action'
                            onClick={() => onCancel()}
                        >
                            {actionNameForCancel ? actionNameForCancel : 'Cancel'}
                        </div>
                    </div>
                </div>
            );
        } else if (hasSingleAction === true) {
            return (
                <div className='empty-notification-actions'>
                    <div className='empty-notification-action-wrapper'>
                        <div
                            className='empty-notification-action'
                            onClick={() => onOK()}
                        >
                            {actionNameForOK ? actionNameForOK : 'OK'}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<></>);
        }
    };

    return (
        <div className='empty-notification-wrapper'>
            <div className='empty-notification'>
                <div className='empty-notification-img-wrapper'>
                    <img className='empty-notification-img' src={img ? img : emptyBoxImg} alt='' draggable='false'></img>
                </div>
                <div className='empty-notification-msg-wrapper'>
                    <div className='empty-notification-msg'>{title}</div>
                </div>
                {renderActionsIfTheyExist()}
            </div>
        </div>
    );
}

export default NotificationIsEmpty;