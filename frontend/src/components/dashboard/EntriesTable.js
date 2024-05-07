import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useToast, Box, Table, Thead, Tr, Td, Tbody, Th, Spinner, Button } from '@chakra-ui/react'
import { UserState } from '../../context/UserContext';
import EditEntryPopup from './EditEntryPopup';

const EntriesTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [decryptedPasswords, setDecryptedPasswords] = useState({});
    // eslint-disable-next-line
    const [passwordVisibility, setPasswordVisibility] = useState({});
    const toast = useToast();

    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [editEntryId, setEditEntryId] = useState(null); // State to track the entry being edited

    const { user } = UserState();
    let userToken = user.token;
    let userId = user._id;
    const [token] = useState(userToken);
    const [id] = useState(userId);
    
    // Function to open the edit popup
    const openEditPopup = (entryId) => {
        setEditEntryId(entryId);
        setEditPopupOpen(true);
    };

    // Function to close the edit popup
    const closeEditPopup = () => {
        setEditPopupOpen(false);
    };

    const fetchEntries = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/user/getEntries/${id}`,
                config
            );

            console.log(data);
            setData(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load entries!\n" + error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
        setLoading(false);
    };

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

    useEffect(() => {
        fetchEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const togglePasswordVisibility = async (index) => {
        if (data[index]) {
            const decryptedPassword = await decryptPassword(data[index].entry_password);
            setDecryptedPasswords({ ...decryptedPasswords, [index]: decryptedPassword });
            setPasswordVisibility(prevVisibility => ({
                ...prevVisibility,
                [index]: !prevVisibility[index]
            }));
        }
    };

    const handleDelete = async (entryId) => {
        try {
            // Send data to API endpoint
            await fetch("http://localhost:8000/api/user/deleteEntry", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ _id: id, entryId: entryId })
            })
            .then(response => {
                // Check if the response is successful
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to delete entry.");
                }
            }).then(data => {
                // Show success toast
                toast({
                    title: "Deletion Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                fetchEntries();
            });
            
            
        } catch (error) {
            console.error('Error deleteing entry:', error);
            toast({
                title: "Error deleting entry!",
                status: "error",
                description: error.message,
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        };
    };

    return (
        <Box 
          maxW="xxl" 
          mx="auto" 
          p="4"
          bg={'white'}
          borderRadius={'lg'}
          borderWidth={'10px'}
          margin={'10px'}
          borderColor={'blue.400'}
        >
           <Table variant="simple" borderWidth="3px" borderColor="blue.100" fontSize="xl">
                <Thead>
                    <Tr >
                        <Th fontSize="20px" py={5}>Entry Name</Th>
                        <Th fontSize="20px" py={5}>Application Name</Th>
                        <Th fontSize="20px" py={5}>Username</Th>
                        <Th fontSize="20px" py={5}>Password</Th>
                        <Th width={'100px'}></Th>
                        <Th width={'100px'}></Th>
                        <Th width={'100px'}></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan="7" textAlign="center">
                                <Spinner size="lg" />
                            </Td>
                        </Tr>
                    ) : (
                        data.map((item, index) => (
                            <Tr key={index}>
                                <Td textAlign={'center'}>{item.entry_name}</Td>
                                <Td textAlign={'center'}>{item.application_name}</Td>
                                <Td textAlign={'center'}>{item.username}</Td>
                                <Td textAlign={'center'}>
                                    {passwordVisibility[index] && decryptedPasswords[index] ? decryptedPasswords[index] : "**********"}
                                </Td>
                                <Td textAlign={'center'}>
                                <Button onClick={() => togglePasswordVisibility(index)}>
                                    {passwordVisibility[index] ? "Hide" : "Show"}
                                </Button>
                                </Td>
                                <Td textAlign={'center'}>
                                    <Button colorScheme="blue" onClick={() => openEditPopup(item._id)}>Edit</Button>
                                    <EditEntryPopup 
                                        isOpen={editPopupOpen} 
                                        onClose={closeEditPopup} 
                                        editEntryId={editEntryId} 
                                        refreshTable={fetchEntries} 
                                    />
                                </Td>
                                <Td textAlign={'center'}>
                                    <Button colorScheme="red" onClick={() => handleDelete(item._id)}>Delete</Button>
                                </Td>
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>
        </Box>
    )
}

export default EntriesTable