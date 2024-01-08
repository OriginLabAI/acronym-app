"use client"

import { useRouter } from 'next/navigation';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import AcronymForm from '../AcronymForm'; 
import AcronymList from '../AcronymList';
import SearchBar from '../SearchBar';
import { UserAuth } from "../config/AuthContext";
import Papa from 'papaparse';
import { Button, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import * as XLSX from 'xlsx';
import ProfileIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, useTheme } from '@mui/material/styles';
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledSwipeableDrawer = styled(MuiSwipeableDrawer)({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  '& ul': {
    listStyle: 'none'
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out'
  }
});

export default function Page() {
  const [acronyms, setAcronyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); 
  const { user, logOut } = UserAuth();
  const [navHover, setNavHover] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  //define this is user layout and pass down
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down('lg'));

    // Toggle function for mobile navigation visibility
    const toggleNavVisibility = () => {
      setNavVisible(!navVisible);
    };
  
    // Drawer Props for Mobile & Tablet screens
    const MobileDrawerProps = {
      open: navVisible,
      onOpen: () => toggleNavVisibility(true),
      onClose: () => toggleNavVisibility(false),
      ModalProps: {
        keepMounted: true, // Better open performance on mobile.
      },
    };
  
    // Drawer Props for Laptop & Desktop screens
    const DesktopDrawerProps = {
      open: isSidebarOpen,
      onOpen: () => setIsSidebarOpen(true),
      onClose: () => setIsSidebarOpen(false),
      onMouseEnter: () => setNavHover(true),
      onMouseLeave: () => setNavHover(false),
    };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const fetchAcronyms = async () => {
        // Fetch acronyms from user's specific collection
        const userAcronymsRef = collection(db, 'users', user.uid, 'acronyms');
        const querySnapshot = await getDocs(userAcronymsRef);
        setAcronyms(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      };

      fetchAcronyms();
    }
  }, [user, router]);

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected.");
        return;
      }
  
      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: false, // Changed to false to not use the first row as header
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              const acronymsFromCSV = results.data; // This is now an array of arrays
              acronymsFromCSV.forEach(async (row) => { // Iterate through each row
                const acronym = row[0].toUpperCase(); // Column A
                const description = row[1]; // Column B
                if (acronym && description) {
                  const docRef = await addDoc(collection(db, 'users', user.uid, 'acronyms'), {
                    acronym: acronym,
                    meaning: description,
                  });
                }
              });
              await fetchAcronyms();
            } catch (error) {
              console.error("Error adding acronyms from CSV to Firebase:", error);
            }
          }
        });
      } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        const reader = new FileReader();
        reader.onerror = () => console.error("Error reading file:", reader.error);
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // Convert the sheet to an array of arrays
            const acronymsFromXLSX = XLSX.utils.sheet_to_json(worksheet, {header:1});
            acronymsFromXLSX.forEach(async (row) => { // Iterate through each row
              const acronym = row[0].toUpperCase(); // Column A
              const description = row[1]; // Column B
              if (acronym && description) {
                const docRef = await addDoc(collection(db, 'users', user.uid, 'acronyms'), {
                  acronym: acronym,
                  meaning: description,
                });
                console.log("Document written with ID: ", docRef.id);
              }
            });
            await fetchAcronyms();
          } catch (error) {
            console.error("Error processing Excel file:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        console.error("Unsupported file type:", file.type);
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };
  
  const fetchAcronyms = async () => {
    try {
      const userAcronymsRef = collection(db, 'users', user.uid, 'acronyms');
      const querySnapshot = await getDocs(userAcronymsRef);
      const fetchedAcronyms = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAcronyms(fetchedAcronyms);
    } catch (error) {
      console.error("Error fetching acronyms:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAcronyms();
  }, [user]);
  
  const handleAddAcronym = async (newAcronym) => {
    const userAcronymsRef = collection(db, 'users', user.uid, 'acronyms');
    const docRef = await addDoc(userAcronymsRef, newAcronym);
    setAcronyms([...acronyms, { ...newAcronym, id: docRef.id }]);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredAcronyms = acronyms.filter((acronym) =>
    acronym && // Ensure acronym is not undefined
    (acronym.acronym?.toLowerCase().includes(searchTerm) ||
    acronym.meaning?.toLowerCase().includes(searchTerm))
  );

  const handleDeleteAcronym = async (acronymId) => {
    const acronymDocRef = doc(db, 'users', user.uid, 'acronyms', acronymId);
    await deleteDoc(acronymDocRef);
    setAcronyms(acronyms.filter(acronym => acronym.id !== acronymId));
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Hamburger Menu Icon */}
      {hidden && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleNavVisibility}
          sx={{ mr: 2, display: { sm: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <StyledSwipeableDrawer
        variant={hidden ? 'temporary' : 'permanent'}
        {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
        PaperProps={{
          sx: {
            width: hidden ? '50vw' : (navHover ? 240 : 50),
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out',
          },
        }}
      >
        {/* Drawer content */}
        <List>
          {/* Add more items as needed */}
          <ListItem button>
            <ListItemIcon>
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" sx={{ display: isSidebarOpen ? 'block' : 'none' }} />
          </ListItem>
        <ListItem button onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" sx={{ display: isSidebarOpen ? 'block' : 'none' }} />
        </ListItem>
      </List>
      </StyledSwipeableDrawer>

      <div className="flex flex-1"> {/* Container for columns */}
        <main className="flex-1 flex justify-center items-center"> {/* Center Column */}
          <div>
            <SearchBar onSearch={handleSearch} />
            <AcronymList acronyms={filteredAcronyms} onDelete={handleDeleteAcronym} />
            <AcronymForm onAdd={handleAddAcronym} />
          </div>
        </main>
        <aside className="w-1/6 bg-gray-50 flex flex-col pt-14"> {/* Modify right column */}
          <div className="flex justify-center items-start pt-12"> {/* Align items to the top */}
            <div>
              <input
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Bulk Upload
                </Button>
              </label>
            </div>
          </div>
        </aside>
        </div>
    </div>
  );
}

