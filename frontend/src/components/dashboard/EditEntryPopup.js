import React, { useEffect, useState } from 'react';
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
import passwordController from "../misc/PasswordControllers";
import PasswordStrengthIndicator from "../decorative/PasswordStrengthIndicator";

const EditEntryPopup = ({ isOpen, onClose, editEntryId, refreshTable }) => {
    const toast = useToast();
    const { user } = UserState();
    const [showPassword, setShowPassword] = useState(false);

    let userToken = user.token;
    let userId = user._id;
    const [token] = useState(userToken);
    const [id] = useState(userId);
    const [entryData, setEntryData] = useState({
        entry_name: '',
        application_name: '',
        username: '',
        entry_password: '',
        user_id: id,
        entry_id: editEntryId
    });

    useEffect(() => {
        if (editEntryId) {
          // Fetch the entry details based on editEntryId
          fetchEntryDetails();
        }
    // eslint-disable-next-line
    }, [editEntryId]);

    const decryptPassword = async (cipher) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const data = {
                cipher: cipher
            }

            const response = await axios.post(
                `api/user/decrypt`,
                data,
                config
            );

            return response.data.cleartext;

        } catch (error) {
            console.error("Decryption error: ", error.message);
            return 'Decryption Failed';
        }
    }

    const fetchEntryDetails = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`/api/user/getEntry/${id}/${editEntryId}`, config);
            const { data } = response;

            const decryptedPassword = await decryptPassword(data.entry_password);

            setEntryData({
                entry_name: data.entry_name,
                application_name: data.application_name,
                username: data.username,
                entry_password: decryptedPassword,
                user_id: id,
                entry_id: editEntryId,
            });
        } catch (error) {
            console.error('Error fetching entry:', error);
            toast({
                title: "Error fetching entry!",
                status: "error",
                description: error.message,
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
    };

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
            if (!entryData.entry_name || !entryData.application_name || !entryData.username || !entryData.entry_password) {
                toast({
                title: "Please enter all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
                });
                return;
            }

            await fetch("http://localhost:8000/api/user/editEntry", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(entryData),
            })
            .then(response => {
                if (response.ok) {
                    onClose();
                    refreshTable();

                    // Reset input fields
                    setEntryData({
                        entry_name: '',
                        application_name: '',
                        username: '',
                        entry_password: '',
                        user_id: id,
                        entry_id: '',
                    });
                }
            });

        } catch (error) {
            console.error('Error submitting entry:', error);
            toast({
                title: "Error updating entry!",
                status: "error",
                description: error.message,
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const generatePassword = () => {
    let password = '';
    password = PasswordController.generatePassword();
    setEntryData(prevData => ({
        ...prevData,
        entry_password: password
    }));
    };
  
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Entry</ModalHeader>
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
                        <PasswordStrengthIndicator strength={passwordController.getPasswordStrength(entryData.entry_password).strength_value} />
                    </FormControl>
                    <Button mt={4} colorScheme="blue" onClick={handleSubmit}>Update</Button>
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

export default EditEntryPopup