import { useState } from 'react';
import { TextField, Button } from '@mui/material';

const AcronymForm = ({ onAdd }) => {
  const [acronym, setAcronym] = useState('');
  const [meaning, setMeaning] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ acronym: acronym.toUpperCase(), meaning }); // Convert acronym to uppercase before sending
    setAcronym('');
    setMeaning('');
  };

  const textFieldStyle = {
    margin: '8px', // Add margin around the TextField
    '& label.Mui-focused': {
      color: '#6366F1', // Indigo-500 color
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#6366F1', // Indigo-500 color
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#6366F1', // Indigo-500 color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366F1', // Indigo-500 color on focus
      },
    },
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Acronym"
        value={acronym}
        onChange={(e) => setAcronym(e.target.value)}
        required
        sx={textFieldStyle}
      />
      <TextField
        label="Meaning"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        required
        sx={textFieldStyle}
      />
    <Button 
      type="submit" 
      sx={{
        marginTop: '15px', // 20px margin at the top
        color: 'grey', // Text color (optional, usually white for contrast)
        '&:hover': {
          backgroundColor: '#A5B4FC', // Slightly darker indigo on hover (adjust as needed)
        }
      }}
    >
      Add
    </Button>

    </form>
  );
};

export default AcronymForm;


