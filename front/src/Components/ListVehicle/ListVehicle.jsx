import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListVehicle.css';

const url = 'http://localhost:3000/vehicles';

const ListVehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({ marca: '', modelo: '', ano: '', preco: '', cor: '', image: '' });
    const [redirectToLogin, setRedirectToLogin] = useState(false); // Define o estado do redirecionamento

    const token = localStorage.getItem('token'); // Acessa o token do localStorage
    const navigate = useNavigate(); // Hook de navegação do React Router

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                if (!token) {
                    // Se não houver token, redireciona para a página de login
                    setRedirectToLogin(true);
                    return;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    // Caso o token esteja expirado ou inválido
                    console.warn('Token inválido ou expirado, redirecionando...');
                    localStorage.removeItem('token');
                    setRedirectToLogin(true); // Aciona o redirecionamento
                    return;
                }

                if (!response.ok) {
                    throw new Error('Falha ao tentar ler os veículos.');
                }

                const data = await response.json();
                setVehicles(data.vehicles);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Desativa o indicador de carregamento
            }
        };

        fetchVehicles();
    }, [token]);

    const deleteVehicle = async (id) => {
        setError(null);
        setLoading(true);

        try {
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
                const errorMessage = await response.text();
                throw new Error(`Falha ao excluir o veículo. Status: ${response.status}. ${errorMessage}`);
            }

            console.log('Veículo deletado com sucesso!');
            setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.id !== id));
        } catch (err) {
            setError(`Erro: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({ ...vehicle });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const updateVehicle = async () => {
        try {
            const response = await fetch(`${url}/${selectedVehicle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Falha ao atualizar o veículo.');
            }
            setVehicles(vehicles.map((vehicle) => (vehicle.id === selectedVehicle.id ? formData : vehicle)));
            setSelectedVehicle(null);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (redirectToLogin) {
            // Redireciona para a página de login quando necessário
            navigate('/login');
        }
    }, [redirectToLogin, navigate]);

    if (loading) return <p>Carregando veículos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="vehicle-list-container">
            <h2>Lista de Veículos</h2>
            {vehicles.length === 0 ? (
                <p>Nenhum veículo encontrado.</p>
            ) : (
                <table className="vehicle-table">
                    <thead>
                        <tr>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Preço</th>
                            <th>Cor</th>
                            <th>Imagem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.marca}</td>
                                <td>{vehicle.modelo}</td>
                                <td>{vehicle.ano}</td>
                                <td>R${vehicle.preco}</td>
                                <td>{vehicle.cor}</td>
                                <td>
                                    {vehicle.image && (
                                        <img
                                            src={`http://localhost:3000/${vehicle.image}`}
                                            alt={`Imagem de ${vehicle.modelo}`}
                                            className="vehicle-image"
                                        />
                                    )}
                                </td>
                                <td className="button-group">
                                    <button className="edit-button" onClick={() => handleEditClick(vehicle)}>Editar</button>
                                    <button className="delete-button" onClick={() => deleteVehicle(vehicle.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedVehicle && (
            <div className="edit-form">
                <h3>Editar veículo</h3>
                
                <div className="form-field">
                    <h4>Marca</h4>
                    <input
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleInputChange}
                        placeholder="Marca"
                    />
                </div>
                
                <div className="form-field">
                    <h4>Modelo</h4>
                    <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        placeholder="Modelo"
                    />
                </div>
                
                <div className="form-field">
                    <h4>Ano</h4>
                    <input
                        type="number"
                        name="ano"
                        value={formData.ano}
                        onChange={handleInputChange}
                        placeholder="Ano"
                    />
                </div>
                
                <div className="form-field">
                    <h4>Preço</h4>
                    <input
                        type="number"
                        name="preco"
                        value={formData.preco}
                        onChange={handleInputChange}
                        placeholder="Preço"
                    />
                </div>
                
                <div className="form-field">
                    <h4>Cor</h4>
                    <input
                        type="text"
                        name="cor"
                        value={formData.cor}
                        onChange={handleInputChange}
                        placeholder="Cor"
                    />
                </div>
                
                <div className="form-field">
                    <h4>Imagem</h4>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                
                <div className="button-group">
                    <button className="save-button" onClick={updateVehicle}>Salvar</button>
                    <button className="cancel-button" onClick={() => setSelectedVehicle(null)}>Cancelar</button>
                </div>
            </div> 
            )}
        </div>
    );
};

export default ListVehicle;