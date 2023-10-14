import './App.css';
import { env } from './env';

function App() {
  return (
    <>
      <p>Hello</p>
      <p>api url: {env.VITE_API_URL}</p>
    </>
  );
}

export default App;
