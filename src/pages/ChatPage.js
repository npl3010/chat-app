import React from 'react';
import { useNavigate } from 'react-router-dom';

// Redux:
import { useSelector } from 'react-redux';


function ChatPage(props) {
    const navigate = useNavigate();

    // Redux:
    const user = useSelector((state) => state.userAuth.user);

    return (
        <div>
            {user !== null ? (
                <div>
                    Hello, {user.displayName}
                    <button onClick={() => navigate('/chat/')}>Chat</button>
                    <button onClick={() => navigate('/login/')}>Login</button>
                    <button onClick={() => navigate('/')}>Home</button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default ChatPage;