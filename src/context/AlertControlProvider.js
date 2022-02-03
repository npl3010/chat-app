import React, { useState } from 'react';


export const AlertControlContext = React.createContext();

function AlertControlProvider({ children }) {
    // State:
    const [isAppAlertMessageVisible, setIsAppAlertMessageVisible] = useState(false);
    const [appAlertMessageData, setAppAlertMessageData] = useState({ type: '', title: '', msg: '', duration: 0 });


    // Methods:
    /**
     * Display Alert Message.
     * @param {string} type Type of Alert Message.
     * @param {string} title Alert Message's title.
     * @param {string} msg Alert Message's message.
     * @param {Number} duration (Unit of time: Seconds) How long it should take to close the Alert Message.
     */
    const showAppAlertMessage = (type = '', title = '', msg = '', duration = 0) => {
        setAppAlertMessageData({ type, title, msg, duration });
        setIsAppAlertMessageVisible(true);
    };

    /**
     * Hide Alert Message.
     */
    const removeAppAlertMessage = () => {
        setAppAlertMessageData({ type: '', title: '', msg: '', duration: 0 });
        setIsAppAlertMessageVisible(false);
    };


    // Component:
    return (
        <AlertControlContext.Provider
            value={{
                isAppAlertMessageVisible, setIsAppAlertMessageVisible,
                appAlertMessageData, setAppAlertMessageData,
                showAppAlertMessage, removeAppAlertMessage
            }}
        >
            {children}
        </AlertControlContext.Provider>
    );
}

export default AlertControlProvider;