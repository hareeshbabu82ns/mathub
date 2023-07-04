import React from "react";
import { Box, Toolbar, Container } from "@mui/material";

import AppBar from "./AppBar"
import Drawer from "./Drawer";

const BasicPage = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>

      <AppBar />
      <Drawer />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

          {children}

        </Container>
      </Box>
    </Box >
  )
}

export default BasicPage