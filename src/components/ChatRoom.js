import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faExclamation } from '@fortawesome/free-solid-svg-icons';

// Components:
import AvatarGroup from './AvatarGroup';

// Redux:
import { useSelector } from 'react-redux';

// Services:
import { addDocument } from '../firebase/services';

// CSS:
import '../styles/scss/components/ChatRoom.scss';

// Custom hooks:
import useFirestore from "../customHooks/useFirestore";


function ChatRoom(props) {
    const messagesEndRef = useRef(null);


    // State:
    const [roomData, setRoomData] = useState({});
    const [inputMessage, setInputMessage] = useState('');


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const rooms = useSelector((state) => state.manageRooms.rooms);
    const selectedChatRoom = useSelector((state) => state.manageRooms.selectedChatRoom);
    const selectedChatRoomUsers = useSelector((state) => state.manageRooms.selectedChatRoomUsers);


    // Side effects:
    useEffect(() => {
        if (selectedChatRoom !== -1 && selectedChatRoom < rooms.length) {
            setRoomData(rooms[selectedChatRoom]);
        }
    }, [rooms, selectedChatRoom]);


    // Methods:
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    }

    const handleInputOnKeyPress = (e) => {
        if (e.charCode === 13) {
            if (inputMessage.length > 0) {
                // Add data to Cloud Firestore:
                const data = {
                    roomId: rooms[selectedChatRoom].id,
                    content: inputMessage,
                    uid: user.uid,
                };
                addDocument('messages', data);

                // Clear form:
                setInputMessage('');
            }
        }
    }

    const getDateAndTimeFromDateString = (dateString) => {
        const objDate = new Date(dateString);
        const strDateTime = objDate.toLocaleString();
        return strDateTime;
    }


    // Hooks:
    const messagesCondition = useMemo(() => {
        const comparisonValue = (selectedChatRoom !== -1 && rooms.length > 0) ? rooms[selectedChatRoom].id : '';
        return {
            fieldName: 'roomId',
            operator: '==',
            value: comparisonValue
        };
    }, [rooms, selectedChatRoom]);

    // Get all messages that belong to this room.
    const messages = useFirestore('messages', messagesCondition);

    // Scroll to bottom if there are new messages:
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages]);


    // Component:
    const renderChatRoomImage = () => {
        if (selectedChatRoom !== -1 && rooms.length > 0) {
            if (rooms[selectedChatRoom].type === 'group-chat') {
                return (
                    <AvatarGroup></AvatarGroup>
                );
            } else {
                return (
                    <div className='person-img-wrapper'>
                        <img className='person-img' src='' alt='' ></img>
                    </div>
                );
            }
        }
    }

    const chatRoomComponent = () => {
        return (
            <>
                <div className='chat-info'>
                    <div className='chat-info__person'>
                        {renderChatRoomImage()}
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

                            {/* <div className='message from-others'>
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
                            </div> */}

                            {
                                messages.slice(0).reverse().map((msg, index) => {
                                    if (msg.uid === user.uid) {
                                        const strDateTime = getDateAndTimeFromDateString(msg.createdAt);
                                        return (
                                            <div key={`msg-${index}`} className='message from-me'>
                                                <div className='message__content'>
                                                    <i>{strDateTime}</i> {/*Delele this line later!*/}
                                                    <span className='message-piece'>{msg.content}</span>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Get user data:
                                        let data = null;
                                        for (let i = 0; i < selectedChatRoomUsers.length; i++) {
                                            if (selectedChatRoomUsers[i].uid === msg.uid) {
                                                data = selectedChatRoomUsers[i];
                                                break;
                                            }
                                        }

                                        // Return:
                                        const strDateTime = getDateAndTimeFromDateString(msg.createdAt);
                                        return (
                                            <div key={`msg-${index}`} className='message from-others'>
                                                <div className='message__person-img'>
                                                    <img className='person-img' src={data ? data.photoURL : ''} alt='' ></img>
                                                </div>
                                                <div className='message__content'>
                                                    <i>{strDateTime}</i> {/*Delele this line later!*/}
                                                    <span className='message-piece'>{msg.content}</span>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                <div className='chat-tools'>
                    <div className='textbox-wrapper'>
                        <div className='textbox'>
                            <input
                                type='text' placeholder='Nhập tin nhắn'
                                value={inputMessage}
                                onChange={(e) => handleInputChange(e)}
                                onKeyPress={(e) => handleInputOnKeyPress(e)}
                            ></input>
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