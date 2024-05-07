// Context file
// Web-app state that can be called at any location or time
// "Single Truth"

import { createContext, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

const UserContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  const history = useHistory();

  useEffect(() => {

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);

      // If user info not found, re-route to homepage
      if (!userInfo) {
        // history.push("/");
        <Redirect to="/" />;
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [history]);

  return (
    <UserContext.Provider
      value={{ user, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a hook useable by other js files
export const UserState = () => {
    return useContext(UserContext);
}

export default ContextProvider;