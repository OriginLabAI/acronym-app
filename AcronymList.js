import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AcronymList = ({ acronyms, onDelete }) => {
  if (acronyms.length === 0) {
    return <div>No data available.</div>;
  }

  const handleDelete = (acronymId) => {
    // Function to handle deletion
    onDelete(acronymId);
  };

  return (
    <TableContainer component={Paper} style={{ maxHeight: 610, minHeight: 610, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Acronym</TableCell>
            <TableCell>Meaning</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {acronyms.map((acronym) => (
            <TableRow key={acronym.id} hover>
              <TableCell>{acronym.acronym}</TableCell>
              <TableCell>{acronym.meaning}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(acronym.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AcronymList;


