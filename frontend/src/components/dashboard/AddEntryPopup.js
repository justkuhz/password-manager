import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from 'axios'; // Import axios for making HTTP requests

const AddEntryPopup = ({ isOpen, onClose }) => {
  const [entryData, setEntryData] = useState({
    entry_name: '',
    application_name: '',
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntryData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate if all fields are filled
        if (!entryData.entry_name || !entryData.application_name || !entryData.username || !entryData.password) {
            alert('Please fill out all fields');
            return;
        }
      
      // Send data to API endpoint
        const response = await axios.post('/api/user/createEntry', entryData);

        onClose();

      // Reset the input fields by clearing the entryData state
        setEntryData({
            entry_name: '',
            application_name: '',
            username: '',
            password: ''
        });

    } catch (error) {
        console.error('Error submitting entry:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Entry</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Entry Name</FormLabel>
            <Input type="text" name="entry_name" value={entryData.entry_name} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Application Name</FormLabel>
            <Input type="text" name="application_name" value={entryData.application_name} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Username</FormLabel>
            <Input type="text" name="username" value={entryData.username} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={entryData.password} 
              onChange={handleChange} 
            />
          </FormControl>
          <Button mt={4} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
          <Button mt={4} ml={4} onClick={handleTogglePassword}>
            {showPassword ? "Hide Password" : "Show Password"}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEntryPopup