import './App.css';
import Frontpg from './frontpg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpg/>}/>
      </Routes>
    </Router>
  );
}
export default App;

