import React, { useEffect } from 'react';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import background from "../resources/homepage.jpg"
import { Redirect, useHistory } from 'react-router-dom';

const Homepage = () => {

  // If user is logged in or userInfo exists, push them to dashboard page
  const history = useHistory();

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        <Redirect to = "/dashboard"></Redirect>
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [history]);

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
      <Container maxW='xl' centerContent>
        <Box
          display={'flex'}
          textAlign={'center'}
          justifyContent={'center'}
          p={3}
          bg={'white'}
          w={'100%'}
          m={'40px 0 15px 0'}
          borderRadius={'lg'}
          borderWidth={'10px'}
          borderColor={'yellow.300'}
        >
          <Text
            alignContent={'center'}
            as='b'
            fontSize={'70px'}
            fontFamily='Work sans'
          >
            Password Manager
          </Text>
        </Box>
        <Box
          bg={'white'}
          w={'100%'}
          p={4}
          borderRadius='lg'
          borderWidth={'10px'}
          color='black'
          borderColor={'yellow.300'}
        >
          <Tabs variant='soft-rounded'>
            <TabList mb='1em'>
              <Tab width='50%' textColor={'black'}>Login</Tab>
              <Tab width='50%' textColor={'black'}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {<Login />}
              </TabPanel>
              <TabPanel>
                {<Signup />}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  )
}

export default Homepage