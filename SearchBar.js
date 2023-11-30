import { Input, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const ariaLabel = {'aria-label': 'description'};

  return (
    <Input
      inputProps={ariaLabel}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: '20px' }}
    />
  );
};

export default SearchBar;

