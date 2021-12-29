import React from 'react';
import { Avatar, Tooltip } from 'antd';

// CSS:
import '../styles/scss/components/ChatRoomMenu.scss';


function ChatRoomMenu(props) {
    return (
        <div className='chatroom-menu'>
            <div className='chatroom-menu__header'>
                <div className='chatroom-menu__info'>
                    <div className='chatroom-menu__members'>
                        <Avatar.Group
                            maxCount={3}
                            maxPopoverTrigger="click"
                            size="large"
                            maxStyle={{ color: '#000', backgroundColor: '#ddd', cursor: 'pointer' }}
                        >
                            <Tooltip title="Username" placement="bottom">
                                <Avatar
                                    style={{ backgroundColor: '#eee' }}
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            </Tooltip>

                            <Tooltip title="Username" placement="bottom">
                                <Avatar style={{ backgroundColor: 'yellowgreen' }}>K</Avatar>
                            </Tooltip>

                            <Tooltip title="Username" placement="bottom">
                                <Avatar
                                    style={{ backgroundColor: '#eee' }}
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            </Tooltip>

                            <Tooltip title="Username" placement="bottom">
                                <Avatar style={{ backgroundColor: '#eee' }}
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            </Tooltip>
                        </Avatar.Group>
                    </div>
                    <div className='chatroom-menu__name'>Tên nhóm nè</div>
                </div>
            </div>

            <div className='chatroom-menu__options'>
                <div className='option-list-wrapper'>
                    <div className='option-list'>
                        <div className='option-item'>
                            <button>Thêm thành viên</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatRoomMenu;