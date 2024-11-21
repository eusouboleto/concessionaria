import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact';
import FormVehicle from './Components/FormVehicle/FormVehicle';
import FormUsers from './Components/FormUsers/FormUsers';
import ListVehicle from './Components/ListVehicle/ListVehicle';
import ListUsers from './Components/ListUsers/ListUsers';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'; 
import WhatsAppButton from './Components/WhatsAppButton/WhatsAppButton';

import './App.css';

function App() {
    const [, setToken] = useState(localStorage.getItem('token') || null);

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <BrowserRouter>
            <div className='app-container'>
                <Header onLogout={handleLogout} />
                <main>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login onLogin={handleLogin} />} />
                        <Route 
                            path='/form-vehicle' 
                            element={
                                <PrivateRoute>
                                    <FormVehicle />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path='/form-users' 
                            element={
                                <PrivateRoute>
                                    <FormUsers />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path='/list-vehicle' 
                            element={
                                <PrivateRoute>
                                    <ListVehicle />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path='/list-users' 
                            element={
                                <PrivateRoute>
                                    <ListUsers />
                                </PrivateRoute>
                            } 
                        />
                        <Route path='/contact' element={<Contact />} />
                    </Routes>
                </main>
                <WhatsAppButton />
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
