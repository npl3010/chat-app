// Modules:
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
  clearRoomList,
  setRoomList,
  clearSelectedChatRoomUserList,
  setSelectedChatRoomUserList,
  setSelectedChatRoom
} from "./features/manageRooms/manageRoomsSlice";

// Custom hooks:
import useFirestore from "./customHooks/useFirestore";


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

  // - Get all rooms that the user is a member of.
  const chatRooms = useFirestore('rooms', roomsCondition);
  // - Get all members of the selected room.
  const selectedRoomUsers = useFirestore('users', selectedRoomUsersCondition);


  // Side effects:
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

  useEffect(() => {
    // 1. Clear room list:
    dispatch(clearRoomList());
    // 2. Set new room list:
    const action = setRoomList(chatRooms);
    dispatch(action);
  }, [dispatch, chatRooms]);

  useEffect(() => {
    // 1. Clear selected room user list:
    dispatch(clearSelectedChatRoomUserList());
    // 2. Set new room list:
    const action = setSelectedChatRoomUserList(selectedRoomUsers);
    dispatch(action);
  }, [dispatch, selectedRoomUsers]);


  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/chat" element={user === null ? <Navigate to="/login" /> : <ChatPage />}></Route>
        <Route exact path="/login" element={user !== null ? <Navigate to="/" /> : <LoginPage />}></Route>
        <Route exact path="/" element={user === null ? <Navigate to="/login" /> : <ChatPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
