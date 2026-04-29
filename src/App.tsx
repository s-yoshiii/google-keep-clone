import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import FlashMessage from './components/FlashMessage';
import { useCurrentUserStore } from './modules/auth/current-user.store';
import { authRepository } from './modules/auth/auth.repository';
import { useEffect, useState } from 'react';
function App() {
  const { setCurrentUser } = useCurrentUserStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchCUrrentUser();
  }, []);
  const fetchCUrrentUser = async () => {
    try {
      const user = await authRepository.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return null;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <FlashMessage />
    </BrowserRouter>
  );
}

export default App;
