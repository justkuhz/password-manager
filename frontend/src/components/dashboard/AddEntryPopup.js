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
import axios from 'axios';
import { UserState } from '../../context/UserContext';
import PasswordController from "../misc/PasswordControllers";
import PasswordStrengthIndicator from "../decorative/PasswordStrengthIndicator";

// Popup modal for adding entry to user model
const AddEntryPopup = ({ isOpen, onClose, refreshTable}) => {
  // Define items and states
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { user } = UserState();
  let userToken = user.token;
  let userId = user._id;
  const [token] = useState(userToken);
  const [id] = useState(userId); 

  const [entryData, setEntryData] = useState({
    entry_name: '',
    application_name: '',
    username: '',
    entry_password: '',
    _id: id
  });

  // Text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntryData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Generate password function
  const generatePassword = () => {
    let password = '';
    password = PasswordController.generatePassword();
    setEntryData(prevData => ({
      ...prevData,
      entry_password: password
    }));
  };

  // On submit button
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
            Authorization: `Bearer ${token}`,
        },
      };

      // Send data to API endpoint
      // eslint-disable-next-line
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
          entry_password: '',
          _id: id
      });

    } catch (error) {
        console.error('Error submitting entry:', error);
        toast({
          title: "Error creating entry!",
          status: "error",
          description: error.message,
          duration: 5000,
          isClosable: true,
          position: "top", 
        })
    }
  };

  // Toggling show/hide password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // User Interface 
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Entry</ModalHeader>
        <ModalCloseButton />
        <ModalBody marginBottom={6}>
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
            <PasswordStrengthIndicator strength={PasswordController.getPasswordStrength(entryData.entry_password).strength_value} />
          </FormControl>
          <Button mt={4} colorScheme="blue" onClick={handleSubmit}>Submit</Button>
          <Button mt={4} ml={4} onClick={handleTogglePassword}>
            {showPassword ? "Hide Password" : "Show Password"}
          </Button>
          <Button mt={4} ml={4} colorScheme="green" onClick={generatePassword}>
            Generate
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEntryPopup