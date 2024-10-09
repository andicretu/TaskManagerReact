import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const TaskDetails = ({ task, onTaskUpdated, onTaskDeleted, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ 
    title: task.title, 
    description: task.description, 
    status: task.status || 'Not started' 
  });

  const token = localStorage.getItem('authToken');

  const handleSaveClick = () => {
    axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
      title: editedTask.title,
      description: editedTask.description,
      status: editedTask.status
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      onTaskUpdated(response.data);
      setIsEditing(false);
    })
    .catch(error => {
      console.error('Error saving task:', error);
      alert('Failed to save task.');
    });
  };

  const handleDeleteClick = () => {
    axios.delete(`http://localhost:8080/api/tasks/${task.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      onTaskDeleted(task.id);
      onClose();
    })
    .catch(error => {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    });
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      {isEditing ? (
        <>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* Status Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>

          {/* Align Save and Close buttons horizontally using flexbox */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" onClick={handleSaveClick}>
              Save
            </Button>
            <Button variant="contained" onClick={() => setIsEditing(false)}>
              Close
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>Task Details</Typography>
          <Typography variant="body1"><strong>Title:</strong> {task.title}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {task.description}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {task.status || 'Not Started'}</Typography>

          {/* Align Edit, Close, Delete buttons horizontally */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mr: 2 }}>
              Edit
            </Button>
            <Button variant="contained" onClick={onClose} sx={{ mr: 2 }}>
              Close
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              Delete
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TaskDetails;


