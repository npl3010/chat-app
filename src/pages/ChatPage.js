import React, { useCallback, useEffect, useState } from 'react';

// Components:
import TopNavigation from '../components/TopNavigation';
import ChatMenu from '../components/ChatMenu';
import ChatRoom from '../components/ChatRoom';
import ChatRoomMenu from '../components/ChatRoomMenu';
import ModalInviteMember from '../components/ModalInviteMember';
import ModalSearchUserForm from '../components/ModalSearchUserForm';
import ModalAddGroupChat from '../components/ModalAddGroupChat';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/pages/ChatPage.scss';


function ChatPage(props) {
    // Redux:
    const selectedChatRoomID = useSelector((state) => state.manageRooms.selectedChatRoomID);


    // State:
    const [isThereASelectedRoom, setIsThereASelectedRoom] = useState(false);
    const [isChatRoomMenuDisplayed, setIsChatRoomMenuDisplayed] = useState(false);
    const [isRightSectionVisibleForSmallDevice, setIsRightSectionVisibleForSmallDevice] = useState(false);


    // Methods:
    const handleDisplayChatRoomMenu = useCallback(() => {
        if (window.innerWidth < 576) {
            setIsRightSectionVisibleForSmallDevice(!isRightSectionVisibleForSmallDevice);
            setIsChatRoomMenuDisplayed(!isRightSectionVisibleForSmallDevice);
        } else {
            setIsChatRoomMenuDisplayed(!isChatRoomMenuDisplayed);
        }
    }, [isChatRoomMenuDisplayed, isRightSectionVisibleForSmallDevice]);


    // Side effects:
    useEffect(() => {
        if (typeof selectedChatRoomID === 'string' && selectedChatRoomID !== '' && isThereASelectedRoom === false) {
            setIsChatRoomMenuDisplayed(true);
            setIsThereASelectedRoom(true);
        }
    }, [selectedChatRoomID, isThereASelectedRoom]);


    // Component:
    return (
        <div className='app-page-wrapper'>
            <TopNavigation></TopNavigation>

            <div className='app-page'>
                <div className='chatpage-wrapper'>
                    <div className='chatpage'>
                        <div className='chatpage__left-section'>
                            <ChatMenu></ChatMenu>
                        </div>

                        <div className={`chatpage__mid-section${selectedChatRoomID ? ' visible-for-small-devices' : ' hidden-for-small-devices'}`}>
                            <ChatRoom
                                setIsChatRoomMenuDisplayed={setIsChatRoomMenuDisplayed}
                            ></ChatRoom>
                        </div>

                        <input
                            id="checkbox-for-chatroom-menu"
                            type="checkbox"
                            name="chatroom-menu-is-displayed"
                            checked={isChatRoomMenuDisplayed}
                            onChange={() => handleDisplayChatRoomMenu()}>
                        </input>

                        <div className={`chatpage__right-section${isRightSectionVisibleForSmallDevice ? ' visible-for-small-devices' : ' hidden-for-small-devices'}`}>
                            <ChatRoomMenu
                                handleDisplayChatRoomMenu={handleDisplayChatRoomMenu}
                            ></ChatRoomMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals: */}
            <ModalSearchUserForm></ModalSearchUserForm>
            <ModalInviteMember></ModalInviteMember>
            <ModalAddGroupChat></ModalAddGroupChat>
        </div>
    );
}

export default ChatPage;