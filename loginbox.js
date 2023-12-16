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