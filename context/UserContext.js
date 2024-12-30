import React, { createContext, useState } from "react";

// Create the UserContext
export const UserContext = createContext();

// Define the UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (newUser) => {
   
    setUser(newUser); // Update user state
    
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {console.log("Current UserContext:", user)}
      {children}
    </UserContext.Provider>
  );
};
