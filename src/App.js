// Modules:
import { useEffect } from "react";
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
import './styles/scss/components/App.scss';

// Firebase:
import { auth, onAuthStateChanged } from './firebase/config';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/auth/userAuthSlice';


function App() {
  // Redux:
  const user = useSelector((state) => state.userAuth.user);
  const dispatch = useDispatch();


  // Side effects:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        const { displayName, email, uid, photoURL } = loggedInUser;
        const action = setUser({ displayName, email, uid, photoURL });
        dispatch(action);
      } else {
        // User is signed out!
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);


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
