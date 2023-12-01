"use client"

import { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import NextLink from 'next/link'; // Import Next.js Link

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Redirect to dashboard or home page after successful login
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* ... other components ... */}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <NextLink href="/signup" passHref>
            <Link variant="body2" component="a">
              {"Don't have an account? Sign Up"}
            </Link>
          </NextLink>
        </Box>
    </Container>
  );
}


