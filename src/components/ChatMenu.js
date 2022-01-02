import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Components:
import ModalSearchUserForm from '../components/ModalSearchUserForm';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ChatMenu.scss';


function ChatMenu(props) {
    const [isModalSearchVisible, setIsModalSearchVisible] = useState(false);


    // // Redux:
    const chatRooms = useSelector((state) => state.manageRooms.rooms);


    // Component:
    return (
        <div className='chatmenu'>
            <div className='chatmenu__header'>
                <div className='chatmenu__actions'>
                    <div className='title'>Chat</div>
                    <div className='action-list'>
                        <div className='action-item action-button more-options-btn'>
                            <FontAwesomeIcon className='action-button__icon addnew-icon' icon={faEllipsisH} />
                        </div>
                        <div
                            className='action-item action-button add-room-btn'
                            onClick={() => setIsModalSearchVisible(!isModalSearchVisible)}
                        >
                            <FontAwesomeIcon className='action-button__icon addnew-icon' icon={faEdit} />
                        </div>
                        <ModalSearchUserForm
                            isModalSearchVisible={isModalSearchVisible}
                            setIsModalSearchVisible={setIsModalSearchVisible}
                        ></ModalSearchUserForm>
                    </div>
                </div>
                <div className='chatmenu__search'>
                    <div className='searchbox-wrapper'>
                        <div className='searchbox'>
                            <input type='text' placeholder='Tìm kiếm người dùng'></input>
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
                                    <div className='chatlist__item' key={`chatRoom-${index}`}>
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

                        {/* <div className='chatlist__item active'>
                            <div className='chatbox'>
                                <div className='chatbox__person-img'>
                                    <img className='person-img' src='' alt='' ></img>
                                </div>
                                <div className='chatbox__info'>
                                    <div className='chatbox-title'>Trần Giả Trân</div>
                                    <div className='chatbox-latest-message'>Tin nhắn mới nhất nè!</div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMenu;