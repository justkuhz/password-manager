// Home/default landing page

import React, { useEffect } from 'react';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../../components/authentication/Login";
import Signup from "../../components/authentication/Signup";
import { Redirect, useHistory } from 'react-router-dom';
import background from "../resources/homepage.jpg"

const Home = () => {
    
    // Get history context
    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        // if user info found we take them to dashboard
        if (userInfo) {
            <Redirect to = "/dashboard" />
        }
    }, [history])

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
          borderWidth={'1px'}
        >
          <Text
            alignContent={"center"}
            as="b"
            fontSize={"50px"}
            fontFamily="Work sans"
          >
            Messaging App
            <Text
              alignContent={"center"}
              fontSize="24px"
              as=""
            >
              < br/>
              Jesse Montel, Kyle Techentin, Ken Zhu
            </Text>
          </Text>
        </Box>
        <Box
          bg={'white'}
          w={'100%'}
          p={4}
          borderRadius='lg'
          borderWidth={'1px'}
          color='black'
        >
          <Tabs variant='soft-rounded'>
            <TabList mb='1em'>
              <Tab width='50%'>Login</Tab>
              <Tab width='50%'>Sign Up</Tab>
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
    );
} 

export default Home;