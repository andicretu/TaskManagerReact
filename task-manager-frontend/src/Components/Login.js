import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/login', credentials)
    .then(response => {
      const jwtToken = response.data.token;
      console.log('Login successful:', jwtToken);
      localStorage.setItem('authToken', jwtToken);
      localStorage.setItem('userEmail', credentials.email);
      navigate('/user-details');
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed!');
    });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={credentials.email}
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
            value={credentials.password}
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
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            onClick={handleRegisterClick}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;

