// Login components for home page

import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from '@chakra-ui/layout';
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import React, { useState } from 'react';
import { Button } from "@chakra-ui/button"; 
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import inputController from "../misc/InputControllers";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const history = useHistory();

    // Hides/shows password
    const handleClick = () => setShow(!show);

    // checks conditions for user to log in
    const submitHandler = async () => {

        // input sanitization
        setEmail(inputController.sanitizeInput(email));
        setPassword(inputController.sanitizeInput(password));

        // check that user and password are filled
        if (!email || !password) {
            toast({
                title: "Please fill out all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (inputController.validateEmail(email) === false) {
            toast({
                title: "Please enter a valid email address",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };

            // Stringify the data object before sending it
            const requestData = JSON.stringify({ email, password });

            const { data } = await axios.post(
                "http://localhost:8000/api/user/login",
                requestData,
                config,
            );

            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoading(false);

            // take user to /dashboard
            history.push("/dashboard");

        } catch (error) {
            toast({
                title: "Login Failed!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px' color='black'>
            
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Enter Your Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme={'blue'}
                width='100%'
                style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                    >
                Log In
            </Button>

        </VStack>
    );
};

export default Login;