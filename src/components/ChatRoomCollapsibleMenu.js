import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown, faPen, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    faImage, faDotCircle
} from '@fortawesome/free-regular-svg-icons';

// Components:
import ChatRoomUserList from './ChatRoomUserList';

// Redux:
import { useSelector } from 'react-redux';

// Services:
import { leaveRoom } from '../firebase/queryRooms';

// CSS:
import '../styles/scss/components/ChatRoomCollapsibleMenu.scss';


function ChatRoomCollapsibleMenu(props) {
    const inlineMenusRef = useRef([]);
    const {
        roomData,
        selectedChatRoomUsers
    } = props;


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [idOfInlineMenuToBeDisplayed, setIdOfInlineMenuToBeDisplayed] = useState(-1);
    const [inlineMenuHeight, setInlineMenuHeight] = useState(0);
    const [inlineMenuOverflow, setInlineMenuOverflow] = useState('hidden'); // If value is 'hidden', child elements can not display outside of inline-menu-wrapper.
    const [isModalLeaveRoomVisible, setIsModalLeaveRoomVisible] = useState(false);

    // Methods:
    const handleToggleBetweenHidingAndShowingMenu = (e, menuNumber) => {
        e.stopPropagation();
        if (idOfInlineMenuToBeDisplayed === menuNumber) {
            setIdOfInlineMenuToBeDisplayed(-1);
        } else {
            setIdOfInlineMenuToBeDisplayed(menuNumber);
        }
    }

    const showModalLeaveRoom = () => {
        setIsModalLeaveRoomVisible(true);
    };

    const handleLeaveRoomOk = () => {
        setIsModalLeaveRoomVisible(false);
        leaveRoom(roomData.id, user.uid)
            .then((res) => {
            });
    };

    const handleLeaveRoomCancel = () => {
        setIsModalLeaveRoomVisible(false);
    };


    // Side effects:
    useEffect(() => {
        // Set inlineMenuHeight:
        if (idOfInlineMenuToBeDisplayed !== -1) {
            setInlineMenuHeight(inlineMenusRef.current[idOfInlineMenuToBeDisplayed].clientHeight);
        }
    }, [idOfInlineMenuToBeDisplayed, roomData, selectedChatRoomUsers])

    useEffect(() => {
        // Set inlineMenuHeight:
        if (idOfInlineMenuToBeDisplayed !== -1) {
            setInlineMenuHeight(inlineMenusRef.current[idOfInlineMenuToBeDisplayed].clientHeight);
        } else {
            setInlineMenuHeight(0);
        }
    }, [idOfInlineMenuToBeDisplayed]);


    // Component:
    return (
        <div className='collapsible-menu-wrapper for-chatroom-menu'>
            <div className='collapsible-menu'>
                <div className='option-list-wrapper'>
                    <div className='option-list'>
                        <div
                            className={`option-list__item${idOfInlineMenuToBeDisplayed === 0 ? ' active' : ''}`}
                        >
                            <div className='option-wrapper'>
                                <div
                                    className='option'
                                    onClick={(e) => handleToggleBetweenHidingAndShowingMenu(e, 0)}
                                >
                                    <div className='option__title'>
                                        <span>Tùy chỉnh đoạn chat</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div
                                    className='inline-menu-wrapper'
                                    style={idOfInlineMenuToBeDisplayed === 0 ? { height: inlineMenuHeight } : {}}
                                >
                                    <div className='inline-menu' ref={(el) => inlineMenusRef.current[0] = el}>
                                        <div className='inline-menu__option'>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faPen} />
                                            </div>
                                            <span>Đổi tên đoạn chat</span>
                                        </div>
                                        <div className='inline-menu__option'>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faImage} />
                                            </div>
                                            <span>Thay đổi ảnh</span>
                                        </div>
                                        <div className='inline-menu__option'>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faDotCircle} />
                                            </div>
                                            <span>Đổi chủ đề</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`option-list__item${idOfInlineMenuToBeDisplayed === 1 ? ' active' : ''}`}
                        >
                            <div className='option-wrapper'>
                                <div
                                    className='option'
                                    onClick={(e) => handleToggleBetweenHidingAndShowingMenu(e, 1)}
                                >
                                    <div className='option__title'>
                                        <span>Thành viên trong đoạn chat</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div
                                    className='inline-menu-wrapper'
                                    style={idOfInlineMenuToBeDisplayed === 1 ? { height: inlineMenuHeight, overflow: inlineMenuOverflow } : {}}
                                >
                                    <div className='inline-menu' ref={(el) => inlineMenusRef.current[1] = el}>
                                        <ChatRoomUserList
                                            roomData={roomData}
                                            selectedChatRoomUsers={selectedChatRoomUsers}
                                            usedForInlineMenuId={1}
                                            setInlineMenuOverflow={setInlineMenuOverflow}
                                            idOfInlineMenuToBeDisplayed={idOfInlineMenuToBeDisplayed}
                                        ></ChatRoomUserList>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`option-list__item${idOfInlineMenuToBeDisplayed === 2 ? ' active' : ''}`}
                        >
                            <div className='option-wrapper'>
                                <div
                                    className='option'
                                    onClick={(e) => handleToggleBetweenHidingAndShowingMenu(e, 2)}
                                >
                                    <div className='option__title'>
                                        <span>Quyền riêng tư &amp; hỗ trợ</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div
                                    className='inline-menu-wrapper'
                                    style={idOfInlineMenuToBeDisplayed === 2 ? { height: inlineMenuHeight } : {}}
                                >
                                    <div className='inline-menu' ref={(el) => inlineMenusRef.current[2] = el}>
                                        <div className='inline-menu__option' onClick={showModalLeaveRoom}>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faSignOutAlt} />
                                            </div>
                                            <span>Rời khỏi nhóm</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className='antd-modal-leave-room'
                title="Xác nhận"
                visible={isModalLeaveRoomVisible}
                onOk={handleLeaveRoomOk}
                onCancel={handleLeaveRoomCancel}
                centered
                okText={'Rời khỏi nhóm'}
                cancelText={'Hủy'}
            >
                <div>Bạn có thật sự muốn rời khỏi nhóm chat?</div>
            </Modal>
        </div >
    );
}

export default ChatRoomCollapsibleMenu;