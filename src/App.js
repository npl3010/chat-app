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
import AppAlertMessage from "./components/AppAlertMessage";

// CSS:
import 'antd/dist/antd.min.css';
import './styles/scss/components/App.scss';

// Firebase:
import { auth, onAuthStateChanged } from './firebase/config';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/auth/userAuthSlice';
import { resetRoomsStatesToInitial } from "./features/manageRooms/manageRoomsSlice";
import { resetFriendListState, setFriendListState } from "./features/manageFriends/manageFriendsSlice";

// Provider:
import ModalControlProvider from "./context/ModalControlProvider";
import AlertControlProvider from "./context/AlertControlProvider";

// Custom hooks:
import useFirestoreCustomized from "./customHooks/useFirestoreCustomized";


function App() {
  // Redux:
  const user = useSelector((state) => state.userAuth.user);
  const dispatch = useDispatch();


  // Variables:
  const user_uid = user === null ? 0 : user.uid;


  // Hooks:
  const friendsCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: '==',
      value: user_uid
    };
  }, [user_uid]);
  // (GET REALTIME UPDATES) Get all friends of the logged in user.
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
        // Reset manageRooms' states:
        dispatch(resetRoomsStatesToInitial());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

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


  // Component:
  return (
    <BrowserRouter>

      {/* Provider: */}
      <ModalControlProvider>
        <AlertControlProvider>

          {/* Routes: */}
          <Routes>
            <Route exact path="/chat" element={user === null ? <Navigate to="/login" /> : <ChatPage />}></Route>
            <Route exact path="/login" element={user !== null ? <Navigate to="/" /> : <LoginPage />}></Route>
            <Route exact path="/" element={user === null ? <Navigate to="/login" /> : <ChatPage />}></Route>
          </Routes>

          {/* Others: */}
          <AppAlertMessage></AppAlertMessage>

        </AlertControlProvider>
      </ModalControlProvider>

    </BrowserRouter>
  );
}

export default App;
