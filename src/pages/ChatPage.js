import React, { useCallback, useEffect, useState } from 'react';

// Components:
import TopNavigation from '../components/TopNavigation';
import ChatMenu from '../components/ChatMenu';
import ChatRoom from '../components/ChatRoom';
import ChatRoomMenu from '../components/ChatRoomMenu';
import ModalInviteMember from '../components/ModalInviteMember';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/pages/ChatPage.scss';


function ChatPage(props) {
    // Redux:
    const selectedChatRoom = useSelector((state) => state.manageRooms.selectedChatRoom);


    // State:
    const [isThereASelectedRoom, setIsThereASelectedRoom] = useState(false);
    const [isChatRoomMenuDisplayed, setIsChatRoomMenuDisplayed] = useState(false);


    // Methods:
    const handleDisplayChatRoomMenu = useCallback(() => {
        setIsChatRoomMenuDisplayed(!isChatRoomMenuDisplayed);
    }, [isChatRoomMenuDisplayed]);


    // Side effects:
    useEffect(() => {
        if (isNaN(selectedChatRoom) === false && selectedChatRoom !== -1 && isThereASelectedRoom === false) {
            handleDisplayChatRoomMenu();
            setIsThereASelectedRoom(true);
        }
    }, [selectedChatRoom, isThereASelectedRoom, handleDisplayChatRoomMenu]);


    // Component:
    return (
        <div>
            <TopNavigation></TopNavigation>

            <div className='chat-page'>
                <div className='chatpage-wrapper'>
                    <div className='chatpage'>
                        <div className='chatpage__left-section'>
                            <ChatMenu></ChatMenu>
                        </div>

                        <div className='chatpage__mid-section'>
                            <ChatRoom></ChatRoom>
                        </div>

                        <input
                            id="checkbox-for-chatroom-menu"
                            type="checkbox"
                            name="chatroom-menu-is-displayed"
                            checked={isChatRoomMenuDisplayed}
                            onChange={() => handleDisplayChatRoomMenu()}>
                        </input>

                        <div className='chatpage__right-section'>
                            <ChatRoomMenu></ChatRoomMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals: */}
            <ModalInviteMember></ModalInviteMember>
        </div>
    );
}

export default ChatPage;