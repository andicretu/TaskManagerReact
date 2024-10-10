import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskDetails from './TaskDetails';
import TaskList from './TaskList'; // Import TaskList component

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  // Fetch tasks for the authenticated user
  const handleTasksFetch = () => {
    const token = localStorage.getItem('authToken');

    axios.get(`http://localhost:8080/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setTasks(response.data);
      console.log('Tasks fetched successfully:', response.data);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks.');
    });
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('authToken'); 

    if (userEmail) {
      axios.get(`http://localhost:8080/api/users/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setUser(response.data);
          console.log('User details fetched successfully:', response.data);
          handleTasksFetch();
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          alert('Failed to fetch user details.');
        });
    } else {
      alert('No user email found in localStorage. Please log in.');
      navigate('/login');
    }
  }, [navigate]);

  const handleTaskClick = (task) => {
    setSelectedTask(task); // Set the clicked task to display its details
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task)); // Update the task in the list
    setSelectedTask(updatedTask); // Update the selected task with new data
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId)); // Remove task from the list
    setSelectedTask(null); // Clear selected task
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleOpenAddTaskDialog = () => {
    setOpenAddTaskDialog(true);
  };

  const handleCloseAddTaskDialog = () => {
    setOpenAddTaskDialog(false);
    setNewTask({ title: '', description: '' });
  };

  const handleAddTask = () => {
    const token = localStorage.getItem('authToken');

    axios.post('http://localhost:8080/api/tasks', newTask, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setTasks([...tasks, response.data]);
      handleCloseAddTaskDialog();
    })
    .catch(error => {
      console.error('Error adding task:', error);
      alert('Failed to add task.');
    });
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" align="center">
            Loading user details...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* User Details Section as a row above the two-column layout */}
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          User Details
        </Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {user.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ width: '20%', mt: 2, align:'left' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Two-column layout: Task List and Task Details */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        
        {/* Task List Section - Use TaskList component */}
        <Box sx={{ flex: 1, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} onAddTask={handleOpenAddTaskDialog} />
        </Box>

        {/* Task Details Section */}
        <Box sx={{ flex: 1, p: 3, boxShadow: 3, borderRadius: 2 }}>
          {selectedTask ? (
            <TaskDetails 
              task={selectedTask}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onClose={() => setSelectedTask(null)}
            />
          ) : (
            <Typography variant="body1" align="center">
              Select a task to view details.
            </Typography>
          )}
        </Box>

      </Box>

      {/* Add Task Dialog */}
      <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the title and description for the new task.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTaskDialog}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" color="primary">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDetails;




