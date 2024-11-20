import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact';
import FormPet from './Components/FormPet/FormPet';
import FormUsers from './Components/FormUsers/FormUsers';
import ListPet from './Components/ListPet/ListPet';
import ListUsers from './Components/ListUsers/ListUsers';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'; 

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
                            path='/form-pet' 
                            element={
                                <PrivateRoute>
                                    <FormPet />
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
                            path='/list-pet' 
                            element={
                                <PrivateRoute>
                                    <ListPet />
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
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
