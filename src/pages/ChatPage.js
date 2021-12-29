import React, { useState } from 'react';

// Components:
import TopNavigation from '../components/TopNavigation';
import ChatMenu from '../components/ChatMenu';
import ChatRoom from '../components/ChatRoom';
import ChatRoomMenu from '../components/ChatRoomMenu';

// CSS:
import '../styles/scss/pages/ChatPage.scss';


function ChatPage(props) {
    const [isChatRoomMenuDisplayed, setIsChatRoomMenuDisplayed] = useState(true);


    // Methods:
    const handleDisplayChatRoomMenu = () => {
        setIsChatRoomMenuDisplayed(!isChatRoomMenuDisplayed);
    }


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
        </div>
    );
}

export default ChatPage;