import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ChatMenu.scss';

// Custom hooks:
import useFirestore from '../customHooks/useFirestore';


function ChatMenu(props) {


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // Hooks:
    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            value: user.uid
        };
    }, [user.uid]);

    const chatRooms = useFirestore('rooms', roomsCondition);


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
                        <div className='action-item action-button add-room-btn'>
                            <FontAwesomeIcon className='action-button__icon addnew-icon' icon={faEdit} />
                        </div>
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