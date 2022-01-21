import React from 'react';
import { Avatar, Tooltip } from 'antd';

// Components:
import ChatRoomCollapsibleMenu from './ChatRoomCollapsibleMenu';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ChatRoomMenu.scss';


function ChatRoomMenu(props) {
    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms, selectedChatRoomID, selectedChatRoomUsers } = useSelector((state) => state.manageRooms);


    // Component:
    const renderGroupOfAvatars = () => {
        return (
            <Avatar.Group
                maxCount={3}
                maxPopoverTrigger="click"
                size="large"
                maxStyle={{ color: '#000', backgroundColor: '#ddd', cursor: 'pointer' }}
            >
                {
                    selectedChatRoomUsers.map((element, index) => {
                        const props = {};
                        if (element.photoURL !== null) {
                            props.src = element.photoURL;
                        }
                        return (
                            <Tooltip title={element.displayName} placement="bottom" key={`user-${index}`}>
                                <Avatar
                                    style={{ backgroundColor: '#eee' }}
                                    {...props}
                                >{element.photoURL === null ? 'U' : ''}</Avatar>
                            </Tooltip>
                        )
                    })
                }
                {/* <Tooltip title="Username" placement="bottom">
                    <Avatar style={{ backgroundColor: '#eee' }} src="" />
                </Tooltip>
                <Tooltip title="Username" placement="bottom">
                    <Avatar style={{ backgroundColor: 'yellowgreen' }}>K</Avatar>
                </Tooltip> */}
            </Avatar.Group>
        );
    };

    const renderSingleUserAvatar = (roomType = '') => {
        // Specify user image to be displayed:
        let imgIndex = -1;
        if (selectedChatRoomUsers.length > 0) {
            if (roomType === 'one-to-one-chat') {
                selectedChatRoomUsers.forEach((element, index) => {
                    if (element.uid !== user.uid) {
                        imgIndex = index;
                    }
                });
            } else if (roomType === 'self-chat') {
                imgIndex = 0;
            } else {
                imgIndex = -1;
            }
        }

        // Get img src:
        const imgSrc = (imgIndex === -1)
            ? '' : (selectedChatRoomUsers[imgIndex].photoURL);

        // Result:
        return (
            <div className='user-avatar-wrapper'>
                {
                    imgSrc === '' ? (
                        <div className='user-avatar' ></div>
                    ) : (
                        <img className='user-avatar' src={imgSrc} alt='' ></img>
                    )
                }
            </div>
        );
    };

    const renderRoomUserAvatars = () => {
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            let roomType = '';
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    roomType = rooms[i].type;
                    break;
                }
            }

            if (roomType === 'one-to-one-chat') {
                return renderSingleUserAvatar('one-to-one-chat');
            } else if (roomType === 'group-chat') {
                return renderGroupOfAvatars();
            } else if (roomType === 'self-chat') {
                return renderSingleUserAvatar('self-chat');
            } else {
                return renderSingleUserAvatar();
            }
        }
    }

    const renderOptionList = () => {
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            let roomType = '';
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    roomType = rooms[i].type;
                    break;
                }
            }

            if (roomType === 'group-chat') {
                return (
                    <>
                        <ChatRoomCollapsibleMenu
                            rooms={rooms}
                            selectedChatRoomID={selectedChatRoomID}
                            selectedChatRoomUsers={selectedChatRoomUsers}
                        ></ChatRoomCollapsibleMenu>
                    </>
                );
            } else {
                return (
                    <></>
                );
            }
        }
    }

    const generateChatRoomName = () => {
        let result = '';
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            let roomType = '';
            let indexOfRoom = -1;
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    roomType = rooms[i].type;
                    indexOfRoom = i;
                    break;
                }
            }

            if (roomType === 'one-to-one-chat') {
                if (selectedChatRoomUsers.length > 0) {
                    for (let i = 0; i < selectedChatRoomUsers.length; i++) {
                        if (selectedChatRoomUsers[i].uid !== user.uid) {
                            result = selectedChatRoomUsers[i].displayName;
                        }
                    }
                }
            } else if (roomType === 'group-chat') {
                if (indexOfRoom !== -1) {
                    result = rooms[indexOfRoom].name;
                } else {
                    result = '';
                }
            }
        }
        return result;
    };

    return (
        <div className='chatroom-menu'>
            <div className='chatroom-menu__header'>
                <div className='chatroom-menu__info'>
                    <div className='chatroom-menu__members'>
                        {renderRoomUserAvatars()}
                    </div>
                    <div className='chatroom-menu__name'>{generateChatRoomName()}</div>
                </div>
            </div>

            <div className='chatroom-menu__options'>
                {renderOptionList()}
                <div></div>
            </div>
        </div>
    );
}

export default ChatRoomMenu;