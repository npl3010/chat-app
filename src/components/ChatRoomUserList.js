import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserPlus, faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setRoomIDWillBeSelected, setTemporaryRoom } from '../features/manageRooms/manageRoomsSlice';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';
import { AlertControlContext } from '../context/AlertControlProvider';

// Services:
import { leaveRoom, setRoleForChatRoomMember } from '../firebase/queryRooms';

// CSS:
import '../styles/scss/components/ChatRoomUserList.scss';


function ChatRoomUserList(props) {
    const {
        roomData,
        selectedChatRoomUsers,
        usedForInlineMenuId,
        setInlineMenuOverflow,
        idOfInlineMenuToBeDisplayed,
    } = props;


    // Context:
    const { isModalInviteVisible, setisModalInviteVisible } = React.useContext(ModalControlContext);
    const { showAppAlertMessage } = React.useContext(AlertControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms } = useSelector((state) => state.manageRooms);
    const dispatch = useDispatch();


    // State:
    const [userRole, setUserRole] = useState('group-member');
    const [indexOfObjectToBeDisplayed, setIndexOfObjectToBeDisplayed] = useState(-1);
    const [isModalLeaveRoomVisible, setIsModalLeaveRoomVisible] = useState(false);
    const [isModalRemoveUserVisible, setIsModalRemoveUserVisible] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);


    // Methods:
    const handleClickDropdownButton = (e, index) => {
        if (index === indexOfObjectToBeDisplayed) {
            setIndexOfObjectToBeDisplayed(-1);
            // setInlineMenuOverflow('hidden');
        } else {
            setIndexOfObjectToBeDisplayed(index);
            setInlineMenuOverflow('visible visible');
        }
    }

    const goToChatRoomWith = (userData) => {
        if (userData) {
            // The param is valid.
        } else {
            return;
        }
        const usersOfRoom = [user.uid, userData.uid];

        // Check if a room (of local room list) for the users above already exists:
        let idOfRoom = '';
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].type === 'one-to-one-chat' && rooms[i].members.length === 2) {
                const allFounded = usersOfRoom.every(uid => {
                    return rooms[i].members.includes(uid);
                });
                if (allFounded === true) {
                    idOfRoom = rooms[i].id;
                    break;
                }
            }
        }

        // If idOfRoom === '', it is probably because of the pagination/load-more.
        // (This means that the app hasn't loaded all the rooms yet).
        if (idOfRoom === '') {
            // Do these steps below:
            // 1. Check if roomIDWillBeSelected is equal to a room's id already exists in database.
            // - If yes:
            // Load the room and store it in temporaryRoom.
            // Load and store all data related to the room, like selectedChatRoomID, selectedChatRoomUsers,... .
            // - If no: do nothing.
        }

        // If a room for the users above already exists, select this room,
        // otherwise you must create a new one.
        if (idOfRoom === '') {
            const newTemporaryRoom = {
                id: 'temporary',
                name: 'Room\'s name',
                description: 'One To One chat',
                type: 'one-to-one-chat',
                members: usersOfRoom,
                state: 'temporary',
                latestMessage: '',
                isSeenBy: [],
                fromOthers_BgColor: '',
                fromMe_BgColor: '',
                createdAt: '',
                lastActiveAt: ''
            };
            dispatch(setTemporaryRoom(newTemporaryRoom));

            // Select the last created chat room.
            dispatch(setRoomIDWillBeSelected(newTemporaryRoom.id));
        } else {
            // Select chat room.
            dispatch(setRoomIDWillBeSelected(idOfRoom));
        }
    };

    // 1. Leave room:
    const showModalLeaveRoom = () => {
        setIndexOfObjectToBeDisplayed(-1);
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

    // 2. Reomove user from a room:
    const showModalRemoveUser = (userData) => {
        setIndexOfObjectToBeDisplayed(-1);
        if (userData) {
            setIsModalRemoveUserVisible(true);
            setTempUserData(userData);
        }
    };
    const handleRemoveUserOk = () => {
        setIsModalRemoveUserVisible(false);
        if (tempUserData) {
            leaveRoom(roomData.id, tempUserData.uid)
                .then((res) => {
                });
        }
    };
    const handleRemoveUserCancel = () => {
        setIsModalRemoveUserVisible(false);
    };

    // 3. Set role:
    const setAdminRoleFor = (userData) => {
        setRoleForChatRoomMember(roomData.id, userData.uid, 'group-admin');
        setIndexOfObjectToBeDisplayed(-1);
    };
    const setMemberRoleFor = (userData) => {
        let count = 0;
        for (let i = 0; i < roomData?.membersRole?.length; i++) {
            if (roomData.membersRole[i] === 'group-admin') {
                count++;
                if (count > 1) {
                    break;
                }
            }
        }
        if (count > 1) {
            setRoleForChatRoomMember(roomData.id, userData.uid, 'group-member');
            setIndexOfObjectToBeDisplayed(-1);
        } else {
            showAppAlertMessage('warning', 'Lưu ý', `Nhóm phải có ít nhất một quản trị viên!`, 10);
            setIndexOfObjectToBeDisplayed(-1);
        }
    };


    // Side effects:
    useEffect(() => {
        if (idOfInlineMenuToBeDisplayed !== -1) {
            if (usedForInlineMenuId !== idOfInlineMenuToBeDisplayed) {
                setIndexOfObjectToBeDisplayed(-1);
                setInlineMenuOverflow('hidden');
            }
        } else {
            setIndexOfObjectToBeDisplayed(-1);
            setInlineMenuOverflow('hidden');
        }
    }, [idOfInlineMenuToBeDisplayed, usedForInlineMenuId, setInlineMenuOverflow]);

    useEffect(() => {
        if (roomData) {
            for (let i = 0; i < roomData?.members?.length; i++) {
                if (roomData.members[i] === user.uid) {
                    setUserRole(roomData.membersRole[i]);
                    break;
                }
            }
        }
    }, [roomData, user.uid])


    // Component:
    const renderDropdownMenuItemList = (userRole, userUid, userInTheList_role, userData) => {
        /**
         * userRole: Params for the user who is using the app.
         * userUid, userInTheList_role, userData: Params for the user info which is displayed in the list.
         */
        if (userRole === 'group-admin') {
            return (
                <>
                    {/* Chat to: */}
                    {
                        userUid === user.uid ? (
                            <></>
                        ) : (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => goToChatRoomWith(userData)}
                            >Nhắn tin</div>
                        )
                    }
                    {/* Set role: */}
                    {
                        userInTheList_role === 'group-admin' ? (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => setMemberRoleFor(userData)}
                            >Gỡ bỏ vai trò quản trị viên</div>
                        ) : (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => setAdminRoleFor(userData)}
                            >Chọn làm quản trị viên</div>
                        )
                    }
                    {/* Get out of group: */}
                    {
                        userUid === user.uid ? (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => showModalLeaveRoom()}
                            >Rời khỏi nhóm</div>
                        ) : (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => showModalRemoveUser(userData)}
                            >Xóa thành viên khỏi nhóm</div>
                        )
                    }
                </>
            );
        } else if (userRole === 'group-member') {
            return (
                <>
                    {
                        userUid === user.uid ? (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => showModalLeaveRoom()}
                            >Rời khỏi nhóm</div>
                        ) : (
                            <div
                                className='object__dropdown-menu-item'
                                onClick={() => goToChatRoomWith(userData)}
                            >Nhắn tin</div>
                        )
                    }
                </>
            );
        } else {
            return (<></>);
        }
    };

    return (
        <div className='object-list-wrapper for-chat-room-menu'>
            {/* List of objects: */}
            <div className='object-list'>
                {
                    roomData.members.map((uid, index) => {
                        // 1. Get info to display:
                        let userData = null;
                        let imgURL = '';
                        let title = '';
                        let role = '';
                        let addedBy = '';
                        let count = 0; // Used to break the loop if count === 2.
                        if (uid === roomData.membersAddedBy[index]) {
                            addedBy = 'group-creator';
                            count++;
                        }
                        for (let i = 0; i < selectedChatRoomUsers.length; i++) {
                            // Get info from user of the chat room:
                            if (selectedChatRoomUsers[i].uid === uid) {
                                userData = selectedChatRoomUsers[i];
                                imgURL = selectedChatRoomUsers[i].photoURL;
                                title = selectedChatRoomUsers[i].displayName;
                                role = roomData.membersRole[index];
                                count++;
                            }
                            // Get info of people who add the user above:
                            if (addedBy !== 'group-creator') {
                                if (selectedChatRoomUsers[i].uid === roomData.membersAddedBy[index]) {
                                    addedBy = selectedChatRoomUsers[i].displayName;
                                    count++;
                                }
                            }
                            // Break the loop if there info is fulfilled:
                            if (count === 2) {
                                break;
                            }
                        }

                        // 2. Result:
                        return (
                            <div className={`object${indexOfObjectToBeDisplayed === index ? ' active' : ''}`} key={`object-${index}`}>
                                <div className='object__left-section'>
                                    <div className='object__img-wrapper'>
                                        {imgURL ? (
                                            <img className='object__img' src={imgURL} alt=''></img>
                                        ) : (
                                            <div className='object__character-name'>
                                                <span>{title?.charAt(0)?.toUpperCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='object__info-wrapper'>
                                        <div className='object__info'>
                                            <div className="object__title">{title}</div>
                                            <div className={`object_role${role === 'group-admin' ? ' label-arrow' : ''}`}>
                                                <span>{role === 'group-admin' ? '(Quản trị viên)' : ''}</span>
                                                <div className='triangle-right'></div>
                                            </div>
                                            {addedBy === 'group-creator' ? (
                                                <div className="object__content">Người tạo nhóm</div>
                                            ) : (
                                                <>
                                                    {addedBy ? (
                                                        <div className="object__content">{`Do ${addedBy} thêm`}</div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='object__right-section'>
                                    <div className='object__dropdown-button' onClick={(e) => handleClickDropdownButton(e, index)}>
                                        <div className='object__action-icon-wrapper'>
                                            <FontAwesomeIcon className='object__action-icon' icon={faEllipsisH} />
                                        </div>
                                        <div className='object__dropdown-menu' onClick={(e) => e.stopPropagation()}>
                                            {renderDropdownMenuItemList(userRole, uid, role, userData)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {/* Actions: */}
            <div className='object-list-action' onClick={() => setisModalInviteVisible(!isModalInviteVisible)}>
                <div className='object-list-action__icon-wrapper'>
                    <FontAwesomeIcon className='object-list-action__icon' icon={faUserPlus} />
                </div>
                <span>Thêm thành viên</span>
            </div>

            {/* Modals: */}
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

            <Modal
                className='antd-modal-remove-user-from-room'
                title="Xác nhận"
                visible={isModalRemoveUserVisible}
                onOk={handleRemoveUserOk}
                onCancel={handleRemoveUserCancel}
                centered
                okText={'Xóa khỏi nhóm'}
                cancelText={'Hủy'}
            >
                <div>Bạn có thật sự muốn xóa {tempUserData?.displayName} khỏi nhóm chat?</div>
            </Modal>
        </div>
    );
}

export default ChatRoomUserList;