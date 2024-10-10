import React from 'react';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';

const TaskList = ({ tasks, onTaskClick, onAddTask }) => {
  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Tasks
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={onAddTask}
      >
        Add Task
      </Button>
      {tasks.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} button onClick={() => onTaskClick(task)}>
              <ListItemText
                primary={task.title}
                secondary={task.description}
              />
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
