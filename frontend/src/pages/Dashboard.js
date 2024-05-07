import background from "../resources/dashboard.jpg"
import { 
  Box, 
  Container, 
  Text, 
  Button, 
  useToast,  
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, {useState} from 'react';
import EntriesTable from "../components/dashboard/EntriesTable";
import AddEntryPopup from "../components/dashboard/AddEntryPopup";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { user } from "../context/UserContext"

const Dashboard = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Instantiate toast
    const toast = useToast();

    // Instantiate history
    const history = useHistory();

    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    }

    // Logout handler function
    const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      history.push("/");
    };

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
          <AddEntryPopup isOpen={isPopupOpen} onClose={togglePopup} />
        </Box>

        {<EntriesTable />}
        
      </Container>
    </Box>
  );
}

export default Dashboard