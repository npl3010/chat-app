import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faUserPlus, faUsers, faSearch } from '@fortawesome/free-solid-svg-icons';

// Components:
import ModalSearchUserForm from '../components/ModalSearchUserForm';
import ModalAddGroupChat from './ModalAddGroupChat';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChatRoom } from '../features/manageRooms/manageRoomsSlice';

// CSS:
import '../styles/scss/components/ChatMenu.scss';


function ChatMenu(props) {
    // State:
    const [isModalSearchVisible, setIsModalSearchVisible] = useState(false);
    const [isModalAddGroupVisible, setisModalAddGroupVisible] = useState(false);


    // Redux:
    const chatRooms = useSelector((state) => state.manageRooms.rooms);
    const selectedChatRoom = useSelector((state) => state.manageRooms.selectedChatRoom);
    const dispatch = useDispatch();


    // Methods:
    const handleClickChatRoom = (roomIndex) => {
        const action = setSelectedChatRoom(roomIndex);
        dispatch(action);
    }


    // Component:
    return (
        <div className='chatmenu'>
            <div className='chatmenu__header'>
                <div className='chatmenu__actions'>
                    <div className='title'>Chat</div>

                    <div className='action-list'>
                        <div className='action-item action-button more-options-btn'>
                            <FontAwesomeIcon className='action-button__icon more-options-icon' icon={faEllipsisH} />
                        </div>
                        <div
                            className='action-item action-button add-room-btn'
                            onClick={() => setIsModalSearchVisible(!isModalSearchVisible)}
                        >
                            <div class="tooltip">
                                <FontAwesomeIcon className='action-button__icon add-room-icon' icon={faUserPlus} />
                                <span class="tooltip__text">Thêm bạn</span>
                            </div>
                        </div>
                        <div
                            className='action-item action-button add-group-chat-btn'
                            onClick={() => setisModalAddGroupVisible(!isModalAddGroupVisible)}
                        >
                            <div class="tooltip">
                                <FontAwesomeIcon className='action-button__icon add-group-chat-icon' icon={faUsers} />
                                <span class="tooltip__text">Tạo nhóm chat</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='chatmenu__search'>
                    <div className='search-box-wrapper'>
                        <div className='search-box'>
                            <FontAwesomeIcon className='search-box__icon' icon={faSearch} />
                            <input className='search-box__input' type='text' placeholder='Tìm kiếm người dùng'></input>
                        </div>
                    </div>
                </div>
            </div>

            <div className='chatmenu__chatlist'>
                <div className='chatlist-wrapper'>
                    <div className='chatlist'>
                        {
                            chatRooms.map((element, index) => {
                                return (
                                    <div
                                        className={`chatlist__item${selectedChatRoom === index ? ' active' : ''}`}
                                        key={`chatRoom-${index}`}
                                        onClick={() => handleClickChatRoom(index)}
                                    >
                                        <div className='chatbox'>
                                            <div className='chatbox__person-img'>
                                                <img className='person-img' src='' alt='' ></img>
                                            </div>
                                            <div className='chatbox__info'>
                                                <div className='chatbox-title'>{element.name}</div>
                                                <div className='chatbox-latest-message'>Tin nhắn mới nhất nè!</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            {/* Modals: */}
            <ModalSearchUserForm
                isModalSearchVisible={isModalSearchVisible}
                setIsModalSearchVisible={setIsModalSearchVisible}
            ></ModalSearchUserForm>

            <ModalAddGroupChat
                isModalAddGroupVisible={isModalAddGroupVisible}
                setisModalAddGroupVisible={setisModalAddGroupVisible}
                setSelectedChatRoom={handleClickChatRoom}
            ></ModalAddGroupChat>
        </div>
    );
}

export default ChatMenu;