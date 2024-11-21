import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './ListUsers.css';

const url = 'http://localhost:3000/users';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const token = localStorage.getItem('token');
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    // Verificação de token dentro de useEffect separado
    useEffect(() => {
        if (!token) {
            setRedirectToLogin(true);
        }
    }, [token]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return;

            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    setRedirectToLogin(true);
                    return;
                }
                if (!response.ok) throw new Error('Failed to fetch users');

                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    if (redirectToLogin) return <Navigate to="/login" replace />;
    if (loading) return <p>Carregando usuários...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({ ...user });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const deleteUser = async (id) => {
        try {
            console.log(`Tentando deletar o usuário com ID: ${id}`);
    
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 401) {
                console.warn('Token inválido ou expirado, redirecionando...');
                localStorage.removeItem('token');
                setRedirectToLogin(true);
                return;
            }
    
            if (!response.ok) {
                console.error('Erro ao deletar usuário:', response.status, await response.text());
                throw new Error('Failed to delete user');
            }
    
            console.log('Usuário deletado com sucesso!');
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (err) {
            console.error('Erro ao deletar usuário:', err.message);
            setError(err.message);
        }
    };
    

    const validateForm = () => {
        if (!formData.username || !formData.email) {
            alert('Preencha todos os campos obrigatórios');
            return false;
        }
        return true;
    };

    const updateUser = async () => {
        if (!validateForm()) return;

        try {
            // Remover a senha se não for alterada
            const updatedData = { ...formData };
            if (!formData.password) delete updatedData.password;

            const response = await fetch(`${url}/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                setRedirectToLogin(true);
                return;
            }
            if (!response.ok) throw new Error('Failed to update user');

            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === selectedUser.id ? updatedData : user))
            );
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="user-list-container">
            <h2>Lista de Usuários</h2>
            {users.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nome de usuário:</th>
                            <th>E-mail:</th>
                            <th>Ações:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td className="button-group">
                                    <button className="edit-button" onClick={() => handleEditClick(user)}>Editar</button>
                                    <button className="delete-button" onClick={() => deleteUser(user.id)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedUser && (
                <div className="edit-form">
                    <h3>Editar usuário</h3>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Nome de usuário"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-mail"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Senha"
                    />
                    <div className="button-group">
                        <button className="save-button" onClick={updateUser}>Salvar</button>
                        <button className="cancel-button" onClick={() => setSelectedUser(null)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListUser;
