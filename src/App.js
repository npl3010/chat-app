import { useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components:
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

// CSS:
import 'antd/dist/antd.min.css';
import './styles/scss/components/App.scss';

// Firebase:
import { auth, onAuthStateChanged } from './firebase/config';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/auth/userAuthSlice';
import {
  clearRoomList, setRoomList,
  clearSelectedChatRoomUserList, setSelectedChatRoomUserList,
  setSelectedChatRoom
} from "./features/manageRooms/manageRoomsSlice";
import {
  resetFriendListState, setFriendListState
} from "./features/manageFriends/manageFriendsSlice";

// Provider:
import ModalControlProvider from "./context/ModalControlProvider";

// Custom hooks:
import useFirestore from "./customHooks/useFirestore";
import useFirestoreCustomized from "./customHooks/useFirestoreCustomized";


function App() {
  // Redux:
  const user = useSelector((state) => state.userAuth.user);
  const { rooms, selectedChatRoom } = useSelector((state) => state.manageRooms);
  const dispatch = useDispatch();


  // State:
  const user_uid = user === null ? 0 : user.uid;


  // Hooks:
  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      value: user_uid
    };
  }, [user_uid]);

  const selectedRoomUsersCondition = useMemo(() => {
    if (selectedChatRoom !== -1 && rooms.length > 0) {
      return {
        fieldName: 'uid',
        operator: 'in',
        value: rooms[selectedChatRoom].members
      };
    } else {
      return {
        fieldName: 'uid',
        operator: 'in',
        value: []
      }
    }
  }, [rooms, selectedChatRoom]);

  const friendsCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: '==',
      value: user_uid
    };
  }, [user_uid]);

  // Use useFirestore() to get realtime updates:
  // - Get all rooms that the user is a member of.
  const chatRooms = useFirestore('rooms', roomsCondition);
  // - Get all members of the selected room.
  const selectedRoomUsers = useFirestore('users', selectedRoomUsersCondition);
  // - Get all friends of the logged in user.
  const userFriends = useFirestoreCustomized('friends', friendsCondition);


  // Side effects:
  // - Store logged in user's info.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        const { displayName, email, uid, photoURL } = loggedInUser;
        const action = setUser({ displayName, email, uid, photoURL });
        dispatch(action);
      } else {
        // User is signed out!
        // - Clear room list:
        dispatch(clearRoomList());
        // - Clear selected room user list:
        dispatch(clearSelectedChatRoomUserList());
        // - Reset selected room to default (-1):
        dispatch((setSelectedChatRoom(-1)));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  // - Get all rooms that the user is a member of.
  useEffect(() => {
    // 1. Clear room list:
    dispatch(clearRoomList());
    // 2. Set new room list:
    const action = setRoomList(chatRooms);
    dispatch(action);
  }, [dispatch, chatRooms]);

  // - Get all members of the selected room.
  useEffect(() => {
    // 1. Clear selected room user list:
    dispatch(clearSelectedChatRoomUserList());
    // 2. Set new room list:
    const action = setSelectedChatRoomUserList(selectedRoomUsers);
    dispatch(action);
  }, [dispatch, selectedRoomUsers]);

  // - Get all friends of the logged in user.
  useEffect(() => {
    if (userFriends.length === 1) {
      // 1. Clear friend list:
      dispatch(resetFriendListState());
      // 2. Set new friend list:
      const action = setFriendListState({
        friendsDocID: userFriends[0].id,
        friends: userFriends[0].friends,
        friendsFrom: userFriends[0].friendsFrom
      });
      dispatch(action);
    }
  }, [dispatch, userFriends]);


  return (
    <BrowserRouter>
      <ModalControlProvider>
        <Routes>
          <Route exact path="/chat" element={user === null ? <Navigate to="/login" /> : <ChatPage />}></Route>
          <Route exact path="/login" element={user !== null ? <Navigate to="/" /> : <LoginPage />}></Route>
          <Route exact path="/" element={user === null ? <Navigate to="/login" /> : <ChatPage />}></Route>
        </Routes>
      </ModalControlProvider>
    </BrowserRouter>
  );
}

export default App;
