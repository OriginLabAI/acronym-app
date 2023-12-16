"use client"

import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import NextLink from 'next/link'; 
import { UserAuth } from "../../config/AuthContext";
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const {user, googleSignIn} = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/'); 
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await googleSignIn();
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
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
            onClick={handleLogin}
          >
            Sign in with Google
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
