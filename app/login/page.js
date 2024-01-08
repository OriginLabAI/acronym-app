"use client"

import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import NextLink from 'next/link'; 
import { UserAuth } from "../../config/AuthContext";
import { useRouter } from 'next/navigation'


export default function LoginPage() {
  const { user, googleSignIn, signInWithEmail } = UserAuth() || {};
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/'); 
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleEmailLogin} noValidate sx={{ mt: 1 }}>
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
            Sign In with Email
          </Button>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2, mb: 2 }}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        <NextLink href="/signup" passHref>
          <Typography
            variant="body1"
            style={{
              cursor: 'pointer',
              color: 'blue', // Sets the text color to blue
              textDecoration: 'underline', // Underlines the text
            }}
          >
            Don't have an account? Sign Up
          </Typography>
        </NextLink>
      </Box>
    </Container>
  );
}