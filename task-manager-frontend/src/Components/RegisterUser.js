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

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });

    if (name === 'email' && !validateEmail(value)) {
      setErrors(prevErrors => ({ ...prevErrors, email: 'Invalid email format' }));
    } else if (name === 'email') {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }

    if (name === 'password' && !validatePassword(value)) {
      setErrors(prevErrors => ({ ...prevErrors, password: 'Password must be at least 8 characters long and contain at least one number' }));
    } else if (name === 'password') {
      setErrors(prevErrors => ({ ...prevErrors, password: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(user.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!validatePassword(user.password)) {
      alert('Password must be at least 8 characters long and contain at least one number');
      return;
    }

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
            error={!!errors.email}
            helperText={errors.email}
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
            error={!!errors.password}
            helperText={errors.password}
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
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterUser;
