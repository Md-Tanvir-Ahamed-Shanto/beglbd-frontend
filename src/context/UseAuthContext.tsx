import { useContext } from 'react';
import { MyContext } from './MyContext';

export const useAuthContext = () => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error('useAuthContext must be used within a MyContextProvider');
  }

  return context;
};
