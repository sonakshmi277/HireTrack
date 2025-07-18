import './App.css';
import Frontpg from './frontpg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './Signin';
import Admindash from './admindash';
import PostNew from './postNew';
import JobPosted from './jobPosted';
import Message from './message';
import Signup from "./Signup";
import UserDashboard from "./userDashboard";
import ApplyNew from "./applyNew";
import JobSeekerMessages from "./jobSeekerMessages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpg/>}/>
        <Route path="/Signin" element={<SignIn/>}/>
        <Route path="/admindash" element={<Admindash/>}/> 
        <Route path="/postNew" element={<PostNew/>}/>  
        <Route path="/jobPosted" element={<JobPosted/>}/>  
        <Route path="/message" element={<Message/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/userDashboard" element={<UserDashboard/>}/>
        <Route path="/applyNew" element={<ApplyNew/>}/>
        <Route path="/jobSeekerMessages" element={<JobSeekerMessages/>}/>
        </Routes>
    </Router>
  );
}
export default App;

