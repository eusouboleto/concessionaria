import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsMessageVisible(false);
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

            setMessage('Login realizado com sucesso!');
            setMessageType('success');
            setIsMessageVisible(true);

            // Redireciona após 1 segundo
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setMessage(err.message);
            setMessageType('error');
            setIsMessageVisible(true);
        } finally {
            setTimeout(() => setLoading(false), 2000);
            // Remove a mensagem após 3 segundos
            setTimeout(() => {
                setIsMessageVisible(false);
                setTimeout(() => {
                    setMessage('');
                    setMessageType('');
                }, 300);
            }, 3000);
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
                    {loading ? 'Efetuando Login...' : 'Logar'}
                </button>
            </form>
            {message && (
                <p
                    className={`message ${messageType} ${
                        isMessageVisible ? 'visible' : 'hidden'
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default Login;
