import React, { useState } from 'react';
import './FormVehicle.css';

const url = 'http://localhost:3000/vehicles';

const FormVehicle = () => {
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        ano: '',
        preco: '',
        cor: '',
        image: '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, image: file }));
    };

    const clearForm = () => {
        setFormData({ marca: '', modelo: '', ano: '', preco: '', cor: '', image: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificação do campo ano
        const currentYear = new Date().getFullYear();
        if (parseInt(formData.ano) > currentYear) {
            alert('O ano não pode ser maior que o ano atual.');
            return; // Impede a submissão do formulário
        }

        const formDataToSend = new FormData();
        formDataToSend.append('marca', formData.marca);
        formDataToSend.append('modelo', formData.modelo);
        formDataToSend.append('ano', formData.ano);
        formDataToSend.append('preco', formData.preco);
        formDataToSend.append('cor', formData.cor);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Falhou em adicinar veículo.');
            }

            const data = await response.json();

            alert(`Veículo adicionado com sucesso! ID: ${data.id}`);

            clearForm();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro catch ao adicionar veículo.');
        }
    };

    return (
        <div className="form-container">
            <div className="form-panel">
            <h2>Cadastro de Veículos</h2>
                <form className="teste" onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Marca:</label>
                        <input
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Modelo:</label>
                        <input
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Ano:</label>
                        <input
                            type="number"
                            name="ano"
                            value={formData.ano}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Preço:</label>
                        <input
                            type="number"
                            step="0.01"
                            name="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Cor:</label>
                        <input
                            type="text"
                            name="cor"
                            value={formData.cor}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <label>Imagem:</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button type="submit" className="button-submit">Cadastrar Veículo</button>
                </form>
            </div>
            <div className="image-panel">
                {formData.image && (
                    <div className="image-preview">
                        <h3>Imagem Selecionada:</h3>
                        <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="preview-image"
                        />
                    </div>
                )}
            </div>
        </div>
    );    
};

export default FormVehicle;
