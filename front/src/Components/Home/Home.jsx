import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1 className="hero-title">Bem-vindo ao AutoConcessionária</h1>
        <p className="hero-description">A plataforma ideal para gerenciar e expandir sua concessionária com facilidade e eficiência!</p>
        <a href="/list-vehicle" className="hero-cta">Visualizar seu Estoque</a>
      </section>
      <section className="about">
        <h2 className="about-title">Sobre o AutoConcessionária</h2>
        <p className="about-description">
          <center>
            <b><span style={{ color: '#1e40af' }}>Parabéns por adquirir o AutoConcessionária!</span></b>
          </center>
          Nossa plataforma foi desenvolvida para tornar a gestão do seu estoque de veículos mais eficiente, com funcionalidades que permitem um controle total sobre seus carros, preços, imagens e muito mais. Aqui você pode gerenciar facilmente sua frota, adicionar novos veículos, adicionar novos usuários, editar informações e acompanhar o desempenho de suas vendas.
        </p>
        <p className="about-description">
          Nossa missão é oferecer uma experiência intuitiva e poderosa para que você possa focar no crescimento da sua concessionária, enquanto cuidamos da parte digital.
        </p>
      </section>
      <section className="featured-vehicles">
        {/* Conteúdo adicional */}
      </section>
    </div>
  );
}

export default Home;
