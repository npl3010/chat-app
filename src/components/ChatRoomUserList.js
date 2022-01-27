import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserPlus, faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

// Redux:
import { useSelector } from 'react-redux';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

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
    const userRole = useRef('');


    // Context:
    const { isModalInviteVisible, setisModalInviteVisible } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [indexOfObjectToBeDisplayed, setIndexOfObjectToBeDisplayed] = useState(-1);


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


    // Component:
    const renderDropdownMenuItemList = (userRole, userUid, userInTheList_role) => {
        /**
         * userRole: Params for the user who is using the app.
         * userUid, userInTheList_role: Params for the user info which is displayed in the list.
         */
        if (userRole === 'group-admin') {
            return (
                <>
                    {/* Chat to: */}
                    {
                        userUid === user.uid ? (
                            <></>
                        ) : (
                            <div className='object__dropdown-menu-item'>Nhắn tin</div>
                        )
                    }
                    {/* Set role: */}
                    {
                        userInTheList_role === 'group-admin' ? (
                            <div className='object__dropdown-menu-item'>Gỡ bỏ vai trò quản trị viên</div>
                        ) : (
                            <div className='object__dropdown-menu-item'>Chọn làm quản trị viên</div>
                        )
                    }
                    {/* Get out of group: */}
                    {
                        userUid === user.uid ? (
                            <div className='object__dropdown-menu-item'>Rời khỏi nhóm</div>
                        ) : (
                            <div className='object__dropdown-menu-item'>Xóa thành viên khỏi nhóm</div>
                        )
                    }
                </>
            );
        } else if (userRole === 'group-member') {
            return (
                <>
                    {
                        userUid === user.uid ? (
                            <div className='object__dropdown-menu-item'>Rời khỏi nhóm</div>
                        ) : (
                            <div className='object__dropdown-menu-item'>Nhắn tin</div>
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

                        // 2. Get the role of user who is using the app:
                        if (userRole.current === '' && user.uid === uid) {
                            userRole.current = roomData.membersRole[index];
                        }

                        // Result:
                        return (
                            <div className={`object${indexOfObjectToBeDisplayed === index ? ' active' : ''}`} key={`object-${index}`}>
                                <div className='object__left-section'>
                                    <div className='object__img-wrapper'>
                                        <img className='object__img' src={imgURL} alt=''></img>
                                    </div>
                                    <div className='object__info-wrapper'>
                                        <div className='object__info'>
                                            <div className="object__title">{title}</div>
                                            <div className="object_role">{role === 'group-admin' ? '(Quản trị viên)' : ''}</div>
                                            <div className="object__content">{addedBy === 'group-creator' ? 'Người tạo nhóm' : `Do ${addedBy} thêm`}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='object__right-section'>
                                    <div className='object__dropdown-button' onClick={(e) => handleClickDropdownButton(e, index)}>
                                        <div className='object__action-icon-wrapper'>
                                            <FontAwesomeIcon className='object__action-icon' icon={faEllipsisH} />
                                        </div>
                                        <div className='object__dropdown-menu' onClick={(e) => e.stopPropagation()}>
                                            {renderDropdownMenuItemList(userRole.current, uid, role)}
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
        </div>
    );
}

export default ChatRoomUserList;