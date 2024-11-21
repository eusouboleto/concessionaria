import React from "react";
import "./WhatsAppButton.css"; // Importando o CSS para estilos

const WhatsAppButton = () => {
  const whatsappNumber = "5515997426160"; // Número de telefone com código do país
  const message = "Olá, gostaria de mais informações!";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Contato via WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="Ícone do WhatsApp"
        className="whatsapp-icon"
      />
    </a>
  );
};

export default WhatsAppButton;
