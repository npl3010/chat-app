import React from 'react';

// CSS:
import '../styles/scss/components/AppMessage.scss';


function AppMessage(props) {
    return (
        <div className='app-message-wrapper'>
            <div className='app-message'>
                <div className='app-message__icon'>
                    <div className='static-icon-wrapper'>
                        <div className='static-icon'></div>
                    </div>
                </div>
                <div className='app-message__content'>
                    <div className='content-wrapper'>
                        <div className='content'></div>
                    </div>
                </div>
                <div className='app-message__actions'>
                    <div className='actions-wrapper'>
                        <div className='actions'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppMessage;