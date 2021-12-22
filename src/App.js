import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from './features/counter/counterSlice';
import './styles/scss/components/App.scss';

function App() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  const handleDecrease = () => {
    const action = decrement();
    dispatch(action);
  }

  const handleIncrease = () => {
    const action = increment();
    dispatch(action);
  }

  return (
    <div className="App">
      <div>Value: {count}</div>
      <button onClick={() => handleDecrease()}>Decrease</button>
      <button onClick={() => handleIncrease()}>Increase</button>
    </div>
  );
}

export default App;
