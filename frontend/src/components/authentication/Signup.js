// Sign up for a new account component of home page
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from '@chakra-ui/layout';
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import React, { useState } from 'react';
import { Button} from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import inputController from "../misc/InputControllers";
import passwordController from "../misc/PasswordControllers";
import PasswordStrengthIndicator from "../decorative/PasswordStrengthIndicator";

// React Component for registering a new account/user
const Signup = () => {
    // Defining component fields and items
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    // Handle user click
    const handleClick = () => setShow(!show);

    // Enter triggers submit
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitHandler();
        }
    }

    // check fields when they click sign up button
    const submitHandler = async() => {
        setLoading(true);

        // if missing any necessary/required fields
        if (!name || !email || !password || !confirmpassword) {
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

        // input sanitization
        setName(inputController.sanitizeInput(name));
        setEmail(inputController.sanitizeInput(email));
        setPassword(inputController.sanitizeInput(password));
        setConfirmpassword(inputController.sanitizeInput(confirmpassword));

        // validate email address
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

        // if password and confirm password are not matching
        if (password !== confirmpassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        // Password strength measurement
        let passwordAnalysis = passwordController.getPasswordStrength(password);
        if (passwordAnalysis.allow === false) {
            toast({
                title: "Your password is too weak.\n" + passwordAnalysis.suggestions[0],
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        // At this point it should be a successful new account creation into mongo database
        try {
            await fetch("http://localhost:8000/api/user/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: name, email: email, password: password})
            })
            .then(response => {
                // Check if the response is successful
                if (response.ok) {
                    // Convert response to JSON
                    return response.json();
                } else {
                    // Log the error status and response text
                    console.error("Registration Failed - Status:", response.status);
                    return response.text().then(text => {
                        throw new Error("Registration Failed - " + text);
                    });
                }
            })
            .then(data => {
                // Show success toast
                toast({
                    title: "Login Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });

                // Store user info in localStorage
                localStorage.setItem("userInfo", JSON.stringify(data));

                // Set loading state to false
                setLoading(false);

                // Navigate user to /dashboard
                history.push("/dashboard");


            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    // User Interface component
    return (
        <VStack spacing='5px' color='black'>

            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Enter Your Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <PasswordStrengthIndicator strength={passwordController.getPasswordStrength(password).strength_value} />
            </FormControl>
         
            <FormControl id='confirmPass' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Confirm Your Password'
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                isLoading = {loading}
            >
                Sign Up
            </Button>

        </VStack>
    );
};

export default Signup;