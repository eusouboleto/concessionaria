import React from 'react';

import './Footer.css';

function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} AutoConcessionária - Todos os direitos reservados.</p>
      <div>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"> Instagram </a>
        <a href="https://www.youtube.com/shorts/0CL7aKLxfOI" target="_blank" rel="noopener noreferrer"> YouTube </a>
      </div>
    </footer>
  );
}

export default Footer;
