import React, { useState } from 'react';
import { 
  useToast, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  FormControl, 
  FormLabel, 
  Input } from "@chakra-ui/react";
import axios from 'axios'; // Import axios for making HTTP requests
import { UserState } from '../../context/UserContext';

const AddEntryPopup = ({ isOpen, onClose, refreshTable}) => {
  const { user } = UserState();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [entryData, setEntryData] = useState({
    entry_name: '',
    application_name: '',
    username: '',
    entry_password: '',
    _id: user._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntryData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate if all fields are filled
      if (!entryData.entry_name || !entryData.application_name || !entryData.username || !entryData.entry_password) {
        toast({
          title: "Please enter all the fields!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
      };

      // Send data to API endpoint
      const response = await axios.put(
        '/api/user/createEntry', 
        entryData,
        config
      );

      onClose();
      refreshTable();

      // Reset the input fields by clearing the entryData state
      setEntryData({
          entry_name: '',
          application_name: '',
          username: '',
          entry_password: ''
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
            <Input type="text" name="entry_name" value={entryData.entry_name} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Application Name</FormLabel>
            <Input type="text" name="application_name" value={entryData.application_name} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Username</FormLabel>
            <Input type="text" name="username" value={entryData.username} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input 
              type={showPassword ? "text" : "password"} 
              name="entry_password" 
              value={entryData.entry_password} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
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