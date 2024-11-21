import React from 'react';
import './Contact.css';

function Contact() {
    return (
        <div className="contact-container">
            <h1>Contato</h1>
            <div className="contact-info">
                <div className="contact-item">
                    <h3>Endereço:</h3>
                    <p>Rua Tião Carreiro e Pardinho, 2 - Sorocaba, SP</p>
                </div>
                <div className="contact-item">
                    <h3>Telefone:</h3>
                    <p>(11) 98765-4321</p>
                </div>
                <div className="contact-item">
                    <h3>E-mail:</h3>
                    <p>carrinho@uniso.com</p>
                </div>
                <div className="contact-item">
                    <h3>Redes Sociais:</h3>
                    <div className="contact-socials">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;