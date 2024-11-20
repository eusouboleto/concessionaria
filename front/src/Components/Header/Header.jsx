import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ onLogout }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout(); 
        navigate('/login'); 
    };

    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/form-pet">Cadastro de Carros</Link></li>
                    <li><Link to="/form-users">Cadastro de Usuários</Link></li>
                    <li><Link to="/list-pet">Consulta de Carros</Link></li>
                    <li><Link to="/list-users">Consulta Usuários</Link></li>
                    <li><Link to="/contact">Contato</Link></li>
                    <li>
                        {token ? (
                            <button onClick={handleLogout}>Logout</button>
                        ) : (
                            <button onClick={() => navigate('/login')}>Login</button>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
