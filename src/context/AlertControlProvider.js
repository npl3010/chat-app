import React, { useState } from 'react';


export const AlertControlContext = React.createContext();

function AlertControlProvider({ children }) {
    // State:
    const [isAppAlertMessageVisible, setIsAppAlertMessageVisible] = useState(false);
    const [appAlertMessageData, setAppAlertMessageData] = useState({ type: '', title: '', msg: '' });


    // Methods:
    const showAppAlertMessage = (type = '', title = '', msg = '') => {
        setAppAlertMessageData({ type, title, msg });
        setIsAppAlertMessageVisible(true);
    };


    // Component:
    return (
        <AlertControlContext.Provider
            value={{
                isAppAlertMessageVisible, setIsAppAlertMessageVisible,
                appAlertMessageData,
                showAppAlertMessage
            }}
        >
            {children}
        </AlertControlContext.Provider>
    );
}

export default AlertControlProvider;