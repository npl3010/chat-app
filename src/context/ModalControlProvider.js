import React, { useState } from 'react';


export const ModalControlContext = React.createContext();

function ModalControlProvider({ children }) {
    // State:
    const [isModalInviteVisible, setisModalInviteVisible] = useState(false);


    // Component:
    return (
        <ModalControlContext.Provider
            value={{
                isModalInviteVisible, setisModalInviteVisible
            }}
        >
            {children}
        </ModalControlContext.Provider>
    );
}

export default ModalControlProvider;