// Modules:
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Components:
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

// CSS:
import './styles/scss/components/App.scss';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/chat" element={<ChatPage />}></Route>
        <Route exact path="/login" element={<LoginPage />}></Route>
        <Route exact path="/" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
