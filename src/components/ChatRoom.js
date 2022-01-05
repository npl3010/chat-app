import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faExclamation } from '@fortawesome/free-solid-svg-icons';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ChatRoom.scss';


function ChatRoom(props) {
    // State:
    const [roomData, setRoomData] = useState({});


    // Redux:
    const chatRooms = useSelector((state) => state.manageRooms.rooms);
    const selectedChatRoom = useSelector((state) => state.manageRooms.selectedChatRoom);


    // Side effects:
    useEffect(() => {
        if (selectedChatRoom !== -1 && selectedChatRoom < chatRooms.length) {
            setRoomData(chatRooms[selectedChatRoom]);
        }
    }, [chatRooms, selectedChatRoom]);


    // Component:
    const chatRoomComponent = () => {
        return (
            <>
                <div className='chat-info'>
                    <div className='chat-info__person'>
                        <div className='person-img-wrapper'>
                            <img className='person-img' src='' alt='' ></img>
                        </div>
                        <div className='person-info'>
                            <span className='person-name'>{roomData.name ? roomData.name : ''}</span>
                            <span className='person-active-status'>Hoạt động 1 giờ trước</span>
                        </div>
                    </div>

                    <div className='chat-info__actions'>
                        <div className='action-list-wrapper'>
                            <div className='action-list'>
                                <label className='action-item' htmlFor="checkbox-for-chatroom-menu">
                                    <FontAwesomeIcon className='action-icon' icon={faInfoCircle} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='chat-content'>
                    <div className='content-wrapper'>
                        <div className='content'>
                            <div className='message from-others'>
                                <div className='message__person-img'>
                                    <img className='person-img' src='' alt='' ></img>
                                </div>
                                <div className='message__content'>
                                    <span className='message-piece'>Xin chào bạn!</span>
                                    <span className='message-piece'>Bạn biết tôi là ai không?</span>
                                    <span className='message-piece'>Alo, bạn ơi bạn có nghe tôi nói không?</span>
                                    <span className='message-piece'>Bạn không thèm nghe tôi nói à?</span>
                                </div>
                            </div>

                            <div className='message from-others'>
                                <div className='message__person-img'>
                                    <img className='person-img' src='' alt='' ></img>
                                </div>
                                <div className='message__content'>
                                    <span className='message-piece'>Alo, nghe rõ trả lời!</span>
                                </div>
                            </div>

                            <div className='message from-me'>
                                <div className='message__content'>
                                    <span className='message-piece'>Ừ xin chào bạn mà tôi méo quen bạn nhé!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='chat-tools'>
                    <div className='textbox-wrapper'>
                        <div className='textbox'>
                            <input type='text' placeholder='Aa'></input>
                        </div>
                    </div>
                </div>
            </>
        )
    };


    return (
        <div className='chatroom'>
            {
                Object.keys(roomData).length > 0 ? (
                    chatRoomComponent()
                ) : (
                    <div className='chatroom__app-message'>
                        <div className='app-message-wrapper'>
                            <div className='app-message'>
                                <div className='app-message__icon-wrapper'>
                                    <FontAwesomeIcon className='app-message__icon' icon={faExclamation} />
                                </div>
                                <div className='app-message__content'>Hãy chọn người dùng để chat</div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ChatRoom;