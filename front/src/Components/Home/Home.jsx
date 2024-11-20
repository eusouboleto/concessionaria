import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1 className="hero-title">Bem-vindo à nossa Concessionária</h1>
        <p className="hero-description">Explore nossa ampla seleção de veículos de alta qualidade.</p>
        <a href="#" className="hero-cta">Ver Estoque</a>
      </section>
      <section className="about">
        <h2 className="about-title">Sobre Nós</h2>
        <p className="about-description">
          Em nossa concessionária, nos orgulhamos de oferecer um atendimento excepcional ao cliente e uma ampla seleção de veículos de alta qualidade. Nossa equipe especializada está dedicada a ajudá-lo a encontrar o carro, caminhão ou SUV perfeito para atender às suas necessidades.
        </p>
      </section>
      <section className="featured-vehicles">
        {/* Conteúdo adicional */}
      </section>
    </div>
  );
}

export default Home;
