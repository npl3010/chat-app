import React, { useState } from 'react';


export const ModalControlContext = React.createContext();

function ModalControlProvider({ children }) {
    // State:
    const [isModalInviteVisible, setisModalInviteVisible] = useState(false);
    const [isModalSearchUserVisible, setIsModalSearchUserVisible] = useState(false);
    const [isModalAddGroupVisible, setisModalAddGroupVisible] = useState(false);


    // Component:
    return (
        <ModalControlContext.Provider
            value={{
                isModalInviteVisible, setisModalInviteVisible,
                isModalSearchUserVisible, setIsModalSearchUserVisible,
                isModalAddGroupVisible, setisModalAddGroupVisible
            }}
        >
            {children}
        </ModalControlContext.Provider>
    );
}

export default ModalControlProvider;