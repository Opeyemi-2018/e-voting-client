"use client";
import { createContext, useContext, useState } from "react";

const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
  const [voterID, setVoterID] = useState(null);

  return (
    <VoterContext.Provider value={{ voterID, setVoterID }}>
      {children}
    </VoterContext.Provider>
  );
};

export const useVoter = () => useContext(VoterContext);
