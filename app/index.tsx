import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Index = ()=> {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null; 
  }

 
  return <Redirect href={isAuthenticated ? '/Home' : '/Login'} />;
}
export default Index;