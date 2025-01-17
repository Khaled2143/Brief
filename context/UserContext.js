import React, { createContext, useState } from "react";

import { jwtDecode } from "jwt-decode";

// Create the UserContext
export const UserContext = createContext();

// Define the UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (newUser) => {
    if (newUser.token) {
      const decodedToken = jwtDecode(newUser.token);
      newUser.userID = decodedToken.userID;
    }
    setUser(newUser); // Update user state
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {console.log("Current UserContext:", user)}
      {children}
    </UserContext.Provider>
  );
};
