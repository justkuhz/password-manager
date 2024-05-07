import background from "../resources/dashboard.jpg"
import { 
  Box, 
  Container, 
  Text, 
  Button, 
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useState, useCallback } from 'react';
import EntriesTable from "../components/dashboard/EntriesTable";
import AddEntryPopup from "../components/dashboard/AddEntryPopup";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  // Instantiate history
  const history = useHistory();
    
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  // Logout handler function
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    setTableKey(0);
  };

  const refreshTable = useCallback(() => {
    // Increment key to trigger component remount
    setTableKey(prevKey => prevKey + 1);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  }

  return (
    <Box
      backgroundImage={`url(${background})`}
      display='flex'
      height={'100vh'}
      width={'100vw'}
      backgroundRepeat={'no-repeat'}
      bgSize="cover"
      backgroundAttachment={"fixed"}
      backgroundPosition="center"
      overflowY={"scroll"}
    >

      <Container maxW='xxl' centerContent>
        <Box
          display={'flex'}
          mx={'auto'}
          justifyContent={'center'}
          p={3}
        >
          <Menu>
              <MenuButton as={Button} colorScheme="blue" rightIcon={<ChevronDownIcon />}>
              Menu
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
          </Menu>
        </Box>

        <Box
          display={'flex'}
          mx={'auto'}
          textAlign={'center'}
          justifyContent={'center'}
          p={4}
          bg={'white'}
          w={'100%'}
          borderRadius={'lg'}
          borderWidth={'10px'}
          borderColor={'blue.400'}
        >
          <Text
            alignContent={'center'}
            as='b'
            fontSize={'50px'}
            color='black'
          >
            Password Manager Dashboard
          </Text>
        </Box>

        <Box
          display={'flex'}
          mx={'auto'}
          textAlign={'center'}
          justifyContent={'center'}
          p={5}
        >
          <Button
            fontSize={'30px'}
            p={10}
            width={'300px'}
            colorScheme="blue"
            onClick={togglePopup}
          >
            Add Entry
          </Button>
          <AddEntryPopup isOpen={isPopupOpen} onClose={togglePopup} refreshTable={refreshTable} />
        </Box>

        {<EntriesTable key={tableKey} />}
        
      </Container>
    </Box>
  );
}

export default Dashboard