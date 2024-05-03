// Context file
// Web-app state that can be called at any location or time
// "Single Truth"

import { createContext, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

const Context = createContext();

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState();

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        // If user not found we boot them to home page
        if (!userInfo) {
            <Redirect to="/" />;
        }
    }, [history]);

    return (
        <Context.ContextProvider
            value = {{ user, setUser }}
        >
            {children}
        </Context.ContextProvider>
    );
};

export default ContextProvider;