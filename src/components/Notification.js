import React from 'react';

// CSS:
import '../styles/scss/components/Notification.scss';


function Notification(props) {
    /**
     * Props:
     * Values for loadingStateFor: "action-OK", "action-Cancel", "".
     */
    const {
        className = '',
        objectName = '',
        objectImgSrc = '',
        createdAt = '',
        isHighlighted = false,
        label = '',
        textBeforeObjectName = '',
        textAfterObjectName = '',
        hasActions = false,
        actionNameForOK = '',
        actionNameForCancel = '',
        onOK = () => { },
        onCancel = () => { },
        loadingStateFor = '',
        allActionsIsDisabled = false,
        message = '',
        handleOnClick = () => { }
    } = props;


    // Component:
    const renderParagraph = () => {
        let firstWhitespace = '';
        let secondWhitespace = '';
        if (textBeforeObjectName.length > 0 && objectName.length > 0) {
            firstWhitespace = ' ';
        }
        if (objectName.length > 0 && textAfterObjectName.length > 0) {
            secondWhitespace = ' ';
        }
        return (
            <>
                <span>{textBeforeObjectName ? textBeforeObjectName : ''}{firstWhitespace}</span>
                <span className='notification__object-name'>{objectName}</span>
                <span>{secondWhitespace}{textAfterObjectName ? textAfterObjectName : ''}</span>
            </>
        );
    };

    const renderActionsIfTheyExist = () => {
        if (hasActions === true && allActionsIsDisabled === false) {
            return (
                <div className='notification__actions'>
                    <div className='action-btn-wrapper'>
                        <div
                            className={`action-btn${loadingStateFor === 'action-OK' ? ' is-loading' : ''}`}
                            onClick={() => onOK()}
                        >
                            {actionNameForOK ? actionNameForOK : 'OK'}
                        </div>
                    </div>
                    <div className='action-btn-wrapper'>
                        <div
                            className={`action-btn${loadingStateFor === 'action-Cancel' ? ' is-loading' : ''}`}
                            onClick={() => onCancel()}
                        >
                            {actionNameForCancel ? actionNameForCancel : 'Cancel'}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<></>);
        }
    };

    const renderMessageIfItExists = () => {
        if (message) {
            return (
                <div className='notification__message'>{message}</div>
            );
        }
    };

    return (
        <div className={`notification-wrapper${className ? (' ' + className) : ''}`}>
            <div className={`notification${isHighlighted ? ' highlighted' : ''}`} onClick={() => handleOnClick()}>
                <div className='notification__object-img'>
                    {objectImgSrc ? (
                        <img className='object-img' src={objectImgSrc} alt='' ></img>
                    ) : (
                        <div className='object-character-name'>
                            <span>{objectName?.charAt(0)?.toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <div className='notification__content'>
                    <div className='notification__label'>{label}</div>
                    <div className='notification__detail'>
                        <div className='notification__paragraph'>
                            {renderParagraph()}
                        </div>
                        <div className='notification__date-time'>{createdAt}</div>
                    </div>
                    {renderMessageIfItExists()}
                    {renderActionsIfTheyExist()}
                </div>
                <div className='notification__state'>
                    {
                        isHighlighted === true ? (
                            <div className='notification__dot'></div>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Notification;