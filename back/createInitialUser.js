const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/concessionaria.db');

// Função para criar o usuário administrador
const createInitialUser = async () => {
    const username = 'admin';
    const email = 'admin@example.com';
    const password = '1234';
    
    // Verificar se o usuário já existe
    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('Erro ao verificar o usuário:', err.message);
            return;
        }

        if (user) {
            console.log('Usuário administrador já existe.');
        } else {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                db.run(
                    'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
                    [username, hashedPassword, email],
                    function(err) {
                        if (err) {
                            console.error('Erro ao criar o usuário inicial:', err.message);
                        } else {
                            console.log('Usuário inicial com ID:', this.lastID, 'criado com sucesso.');
                        }
                    }
                );
            } catch (error) {
                console.error('Erro ao criar o usuário:', error);
            }
        }
    });
};

// Exportar a função
module.exports = createInitialUser;