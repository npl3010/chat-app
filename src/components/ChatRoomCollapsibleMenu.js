import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Modal } from 'antd';
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
import { leaveRoom, renameGroupChatRoom } from '../firebase/queryRooms';

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
    // Modal 1:
    const [isModalLeaveRoomVisible, setIsModalLeaveRoomVisible] = useState(false);
    // Modal 2:
    const [isModalRenameRoomVisible, setIsModalRenameRoomVisible] = useState(false);


    // Hooks:
    const [formRenameRoom] = Form.useForm();


    // Methods:
    const handleToggleBetweenHidingAndShowingMenu = (e, menuNumber) => {
        e.stopPropagation();
        if (idOfInlineMenuToBeDisplayed === menuNumber) {
            setIdOfInlineMenuToBeDisplayed(-1);
        } else {
            setIdOfInlineMenuToBeDisplayed(menuNumber);
        }
    }

    // 1. Leave room:
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

    // 2. Rename room:
    const showModalRenameRoom = () => {
        setIsModalRenameRoomVisible(true);
    };
    const handleRenameRoomOk = () => {
        formRenameRoom.submit();
        // Rename the room:
        if (formRenameRoom.getFieldValue('newRoomName')) {
            renameGroupChatRoom(roomData.id, formRenameRoom.getFieldValue('newRoomName'))
                .then((res) => {
                    formRenameRoom.resetFields();
                    setIsModalRenameRoomVisible(false);
                });
        }
    };
    const handleRenameRoomCancel = () => {
        formRenameRoom.resetFields();
        setIsModalRenameRoomVisible(false);
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
                                        <span>T??y ch???nh ??o???n chat</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div
                                    className='inline-menu-wrapper'
                                    style={idOfInlineMenuToBeDisplayed === 0 ? { height: inlineMenuHeight } : {}}
                                >
                                    <div className='inline-menu' ref={(el) => inlineMenusRef.current[0] = el}>
                                        <div className='inline-menu__option' onClick={showModalRenameRoom}>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faPen} />
                                            </div>
                                            <span>?????i t??n ??o???n chat</span>
                                        </div>
                                        <div className='inline-menu__option is-disabled'>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faImage} />
                                            </div>
                                            <span>Thay ?????i ???nh</span>
                                        </div>
                                        <div className='inline-menu__option is-disabled'>
                                            <div className='inline-menu__option-icon-wrapper'>
                                                <FontAwesomeIcon className='inline-menu__option-icon' icon={faDotCircle} />
                                            </div>
                                            <span>?????i ch??? ?????</span>
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
                                        <span>Th??nh vi??n trong ??o???n chat</span>
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
                                        <span>Quy???n ri??ng t?? &amp; h??? tr???</span>
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
                                            <span>R???i kh???i nh??m</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals: */}
            <Modal
                className='antd-modal-leave-room'
                title="X??c nh???n"
                centered
                visible={isModalLeaveRoomVisible}
                onOk={handleLeaveRoomOk}
                onCancel={handleLeaveRoomCancel}
                okText={'R???i kh???i nh??m'}
                cancelText={'H???y'}
            >
                <div>B???n c?? th???t s??? mu???n r???i kh???i nh??m chat?</div>
            </Modal>

            <Modal
                className='antd-modal-rename-group-chat'
                title="?????i t??n nh??m chat"
                centered
                visible={isModalRenameRoomVisible}
                onOk={handleRenameRoomOk}
                onCancel={handleRenameRoomCancel}
                okText='?????i t??n'
                cancelText='H???y'
            >
                <Form
                    className='antd-rename-group-chat-form'
                    form={formRenameRoom}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="T??n m???i"
                        name="newRoomName"
                        rules={[{ required: true, message: 'H??y nh???p t??n m???i cho nh??m!' }]}
                    >
                        <Input placeholder='Nh???p t??n nh??m' />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}

export default ChatRoomCollapsibleMenu;