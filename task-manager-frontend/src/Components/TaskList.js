import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TaskList = ({ tasks, onTaskClick, onAddTask }) => {
  const [filterStatus, setFilterStatus] = useState('All');

  const statusMap = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredTasks = filterStatus === 'All'
    ? tasks
    : tasks.filter(task => {
        if (filterStatus === 'Not Started') return task.status === 'NOT_STARTED';
        if (filterStatus === 'In Progress') return task.status === 'IN_PROGRESS';
        if (filterStatus === 'Done') return task.status === 'DONE';
        return true;
      });

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Tasks
      </Typography>

      {/* Add Task Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={onAddTask}
      >
        Add Task
      </Button>

      {/* Filter Dropdown below Add Task Button */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          label="Status Filter"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Not Started">Not Started</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>

      {filteredTasks.length > 0 ? (
        <List>
          {filteredTasks.map((task) => (
            <ListItem key={task.id} button onClick={() => onTaskClick(task)}>
              <ListItemText
                primary={task.title}
                secondary={task.description}
              />
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'center',
                  color:
                    task.status === 'NOT_STARTED' ? 'red' :
                    task.status === 'IN_PROGRESS' ? 'orange' :
                    'green'
                }}
              >
                {statusMap[task.status] || task.status}
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" align="center">
          No tasks available.
        </Typography>
      )}
    </div>
  );
};

export default TaskList;

