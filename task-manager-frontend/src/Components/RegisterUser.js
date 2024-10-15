import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterUser = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/register', user)
      .then(response => {
        console.log(response.data);
        alert('User registered successfully!');
        navigate('/login');
      })
      .catch(error => {
        console.error(error);
        alert('Error registering user!');
      });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            onClick={handleLoginClick}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterUser;


