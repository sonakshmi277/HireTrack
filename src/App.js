import './App.css';
import Frontpg from './frontpg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './Signin';
import Dashboard from './Dashboard';
import Admindash from './admindash';
import PostNew from './postNew';
import JobPosted from './jobPosted';
import Message from './message';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpg/>}/>
        <Route path="/Signin" element={<SignIn/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/admindash" element={<Admindash/>}/> 
        <Route path="/postNew" element={<PostNew/>}/>  
        <Route path="/jobPosted" element={<JobPosted/>}/>  
        <Route path="/message" element={<Message/>}/>
        </Routes>
    </Router>
  );
}
export default App;

