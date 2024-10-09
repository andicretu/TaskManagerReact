import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterUser from './Components/RegisterUser';
import Login from './Components/Login';
import UserDetails from './Components/UserDetails';
import TaskDetails from './Components/TaskDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Task Manager Application</h1>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Define Route for Login */}
          <Route path="/register" element={<RegisterUser />} /> {/* Define Route for RegisterUser */}
          <Route path="/" element={<Login />} /> {/* Default route set to Login */}
          <Route path="/user-details" element={<UserDetails />} /> {/* Add the UserDetails route */}
          <Route path="/tasks" element={<TaskDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

