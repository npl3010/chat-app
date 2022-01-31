import React from 'react';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setRoomIDWillBeSelected, setTemporaryRoom } from '../features/manageRooms/manageRoomsSlice';


function AppButtonForJoiningChatRoom(props) {
    const {
        userData = null,
        doActionAfter = () => { }
    } = props;


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms } = useSelector((state) => state.manageRooms);
    const dispatch = useDispatch();


    // Methods:
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

            // Final action:
            doActionAfter();
        } else {
            // Select chat room.
            dispatch(setRoomIDWillBeSelected(idOfRoom));

            // Final action:
            doActionAfter();
        }
    };


    // Component:
    return (
        <div className='app-btns for-joining-chat-room'>
            <div className='app-btn-wrapper' onClick={() => goToChatRoomWith(userData)}>
                <div className={`app-btn`}>Nhắn tin</div>
            </div>
        </div>
    );
}

export default AppButtonForJoiningChatRoom;