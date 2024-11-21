import React, { useState } from 'react';
import './FormUsers.css';

const FormUsers = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setFormData({ username: '', password: '', email: '' });
            } else {
                setMessage(data.message || 'O registro de usuário falhou.');
            }
        } catch (error) {
            setMessage('Algum erro maluco aconteceu.');
        }
    };

    return (
        <div>
			<div className="form-container">
				<div className="form-panel">
                <h2>Cadastro de Usuários</h2>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Nome de usuário:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="field">
                    <label>Senha:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="field">
                    <label>E-mail:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="btn-submit" type="submit">Criar</button>
            </form>
			</div>
			</div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FormUsers;

