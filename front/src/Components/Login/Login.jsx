import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha no login. Tente novamente.');
            }

            const { token } = await response.json();
            localStorage.setItem('token', token);

            // Adiciona um pequeno delay antes de navegar
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            // Garante que o estado de carregamento termine após o delay
            setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="field">
                    <label htmlFor="username">Nome de usuário:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="password">Senha:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="login-btn" type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Logar'}
                </button>
            </form>
            {error && <ErrorMessage message={error} />}
        </div>
    );
};

// Componente para exibição de mensagens de erro
const ErrorMessage = ({ message }) => {
    return <p className="error">{message}</p>;
};

export default Login;
