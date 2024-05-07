import background from "../resources/dashboard.jpg"
import { Box, Container, Text, Button } from "@chakra-ui/react";
import React, {useState} from 'react';
import EntriesTable from "../components/dashboard/EntriesTable";
import AddEntryPopup from "../components/dashboard/AddEntryPopup";

const Dashboard = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
          textAlign={'center'}
          justifyContent={'center'}
          p={4}
          bg={'white'}
          w={'100%'}
          borderRadius={'lg'}
          borderWidth={'10px'}
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
            colorScheme="green"
            textColor={'black'}
            onClick={togglePopup}
          >
            Add Entry
          </Button>
          <AddEntryPopup isOpen={isPopupOpen} onClose={togglePopup} />
        </Box>

        {<EntriesTable />}
        
      </Container>
    </Box>
  )
}

export default Dashboard