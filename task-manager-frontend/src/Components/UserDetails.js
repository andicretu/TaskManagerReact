import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskDetails from './TaskDetails';
import TaskList from './TaskList';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); 
  const navigate = useNavigate();

  const sortTasks = (tasks) => {
    const statusOrder = { 'NOT_STARTED': 1, 'IN_PROGRESS': 2, 'DONE': 3 };
    return tasks.sort((a, b) => (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0));
  };

  const handleTasksFetch = useCallback((page = 0, size = 5) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Authentication token is missing. Please log in.');
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:8080/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        page,
        size,
      }
    })
    .then(response => {
      const tasks = response.data.content;
      const sortedTasks = sortTasks(tasks);
      setTasks(sortedTasks);
      setTotalPages(response.data.totalPages);
      console.log('Tasks fetched and sorted successfully:', sortedTasks);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
      alert('Failed to fetch tasks.');
    });
  }, [navigate]);

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
          handleTasksFetch(currentPage);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          alert('Failed to fetch user details.');
        });
    } else {
      alert('No user email found in localStorage. Please log in.');
      navigate('/login');
    }
  }, [navigate, handleTasksFetch, currentPage]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdated = (updatedTask) => {
    const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    setTasks(sortTasks(updatedTasks));
    setSelectedTask(updatedTask);
  };

  const handleTaskDeleted = (taskId) => {
    const remainingTasks = tasks.filter(task => task.id !== taskId);
    setTasks(sortTasks(remainingTasks));
    setSelectedTask(null);
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
      const updatedTasks = [...tasks, response.data];
      setTasks(sortTasks(updatedTasks));
      handleCloseAddTaskDialog();
    })
    .catch(error => {
      console.error('Error adding task:', error);
      alert('Failed to add task.');
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
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
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Details
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
          sx={{ width: '20%', mt: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Two-column layout: Task List and Task Details */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        
        {/* Task List Section */}
        <Box sx={{ flex: 1, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} onAddTask={handleOpenAddTaskDialog} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</Button>
            <Typography>Page {currentPage + 1} of {totalPages}</Typography>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</Button>
          </Box>
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
