import React from 'react';
import { Avatar, Tooltip } from 'antd';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ChatRoomMenu.scss';


function ChatRoomMenu(props) {
    // State:


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms, selectedChatRoom, selectedChatRoomUsers } = useSelector((state) => state.manageRooms);


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
        if (selectedChatRoom !== -1 && rooms.length > 0) {
            if (rooms[selectedChatRoom].type === 'one-to-one-chat') {
                return renderSingleUserAvatar('one-to-one-chat');
            } else if (rooms[selectedChatRoom].type === 'group-chat') {
                return renderGroupOfAvatars();
            } else if (rooms[selectedChatRoom].type === 'self-chat') {
                return renderSingleUserAvatar('self-chat');
            } else {
                return renderSingleUserAvatar();
            }
        }
    }

    const renderOptionList = () => {
        if (selectedChatRoom !== -1 && rooms.length > 0) {
            if (rooms[selectedChatRoom].type === 'group-chat') {
                return (
                    <>
                        <button className='option-list__button'>Thêm thành viên</button>
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
        if (selectedChatRoom !== -1 && rooms.length > 0) {
            if (rooms[selectedChatRoom].type === 'one-to-one-chat') {
                if (selectedChatRoomUsers.length > 0) {
                    for (let i = 0; i < selectedChatRoomUsers.length; i++) {
                        if (selectedChatRoomUsers[i].uid !== user.uid) {
                            result = selectedChatRoomUsers[i].displayName;
                        }
                    }
                }
            } else if (rooms[selectedChatRoom].type === 'group-chat') {
                result = rooms[selectedChatRoom].name;
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
                <div className='option-list-wrapper'>
                    <div className='option-list'>
                        <div className='option-list__item'>
                            {renderOptionList()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatRoomMenu;