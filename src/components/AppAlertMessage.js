import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamation, faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';

// Context:
import { AlertControlContext } from '../context/AlertControlProvider';

// CSS:
import '../styles/scss/components/AppAlertMessage.scss';


function AppAlertMessage(props) {
    /**
     * Props:
     * Values for type: "", "success", "info", "warning", "danger".
     */
    // const {
    //     type = '',
    //     title = '',
    //     msg = ''
    // } = props;
    const timeoutID = useRef(null);


    // Context:
    const {
        isAppAlertMessageVisible,
        appAlertMessageData,
        removeAppAlertMessage
    } = React.useContext(AlertControlContext);


    // State:
    // const [timeLeft, setTimeLeft] = useState(false);


    // Methods:
    const handleClickCloseBtn = () => {
        removeAppAlertMessage();
        clearTimeout(timeoutID.current);
    };


    // Side effects:
    useEffect(() => {
        if (typeof appAlertMessageData.duration === "number") {
            if (appAlertMessageData.duration > 0) {
                timeoutID.current = setTimeout(() => {
                    removeAppAlertMessage();
                }, appAlertMessageData.duration * 1000);
            }
        }

        return (() => {
            clearTimeout(timeoutID.current);
        });
    }, [appAlertMessageData.duration, removeAppAlertMessage]);


    // Component:
    const renderIcon = () => {
        if (appAlertMessageData.type) {
            if (appAlertMessageData.type === 'success') {
                return faCheck;
            } else if (appAlertMessageData.type === 'info') {
                return faQuestion;
            } else if (appAlertMessageData.type === 'warning') {
                return faExclamation;
            } else if (appAlertMessageData.type === 'danger') {
                return faExclamation;
            } else {
                return faExclamation;
            }
        } else {
            return faExclamation;
        }
    };

    return (
        <>
            {
                isAppAlertMessageVisible === true ? (
                    <div className='app-alert-message-wrapper'>
                        <div className={`app-alert-message${appAlertMessageData.type ? (' ' + appAlertMessageData.type) : ''}`}>
                            <div className='app-alert-message__icon'>
                                <div className='static-icon-wrapper'>
                                    <FontAwesomeIcon className='static-icon' icon={renderIcon()} />
                                </div>
                            </div>
                            <div className='app-alert-message__content'>
                                <div className='content-wrapper'>
                                    <div className='content'>
                                        <div className='title'>{appAlertMessageData.title ? appAlertMessageData.title : ''}</div>
                                        <div className='msg'>{appAlertMessageData.msg ? appAlertMessageData.msg : ''}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='app-alert-message__actions'>
                                <div className='actions-wrapper'>
                                    <div className='action'>
                                        <div className='action-button close-btn' onClick={() => handleClickCloseBtn()}>
                                            <FontAwesomeIcon className='action-button-icon' icon={faTimes} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )
            }
        </>
    );
}

export default AppAlertMessage;