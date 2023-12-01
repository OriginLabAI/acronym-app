"use client"

import { useRouter } from 'next/navigation';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import AcronymForm from '../AcronymForm'; 
import AcronymList from '../AcronymList';
import SearchBar from '../SearchBar';
import { deleteDoc, doc } from 'firebase/firestore';


export default function Page() {
  const [acronyms, setAcronyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Define router here

  useEffect(() => {
    const fetchAcronyms = async () => {
      const querySnapshot = await getDocs(collection(db, 'acronyms'));
      setAcronyms(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchAcronyms();
  }, []);
  
  const handleAddAcronym = async (newAcronym) => {
    await addDoc(collection(db, 'acronyms'), newAcronym);
    setAcronyms([...acronyms, newAcronym]);
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
    await deleteDoc(doc(db, 'acronyms', acronymId));
    setAcronyms(acronyms.filter(acronym => acronym.id !== acronymId));
  };

  const handleSignOut = () => {
    // Implement sign-out logic here if needed
    router.push('/login'); // Navigate to login page using Next.js router
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between p-4 bg-white"> {/* Adjust header for layout */}
        <h1>Your Header Content Here</h1>
        <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign Out
        </button> {/* Sign Out Button */}
      </header>
      <div className="flex flex-1"> {/* Container for columns */}
        <aside className="w-1/6 bg-gray-50"> {/* Left Column */}
          {/* Left Column Content */}
        </aside>
        <main className="flex-1 flex justify-center items-center"> {/* Center Column */}
          <div>
            <SearchBar onSearch={handleSearch} />
            <AcronymList acronyms={filteredAcronyms} onDelete={handleDeleteAcronym} />
            <AcronymForm onAdd={handleAddAcronym} />
          </div>
        </main>
        <aside className="w-1/6 bg-gray-50"> {/* Right Column */}
          {/* Right Column Content */}
        </aside>
      </div>
    </div>
  );
}

