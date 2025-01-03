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
                    <li><Link to="/form-vehicle">Cadastrar Veículo</Link></li>
                    <li><Link to="/form-users">Cadastrar Usuário</Link></li>
                    <li><Link to="/list-vehicle">Meus Veículos</Link></li>
                    <li><Link to="/list-users">Consultar Usuários</Link></li>
                    <li><Link to="/contact">Contato</Link></li>
                    <li>
                        {token ? (
                            <button className="header-button" onClick={handleLogout}>Logout</button>
                        ) : (
                            <button className="header-button" onClick={() => navigate('/login')}>Login</button>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
