// Importar módulos necessários
const express = require('express');
const cors = require('cors');
const db = require('./db-concessionaria');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');

// Carregar variáveis de ambiente
dotenv.config();
const secretKey = process.env.SECRET_KEY;

// Garantir que o diretório 'uploads' exista
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware para autenticar token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Sem token, não autorizado

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido, proibido
        req.user = user; // Anexar informações do usuário ao objeto de solicitação
        next();
    });
};

// Configurar o aplicativo Express
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Rotas e Endpoints
// Endpoints relacionados a vehicles (não é necessário autenticação para estes)
app.get('/vehicles', (req, res) => {
    db.all('SELECT * FROM Vehicles', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ vehicles: rows });
    });
});

app.post('/vehicles', upload.single('image'), (req, res) => {
    const { marca, modelo, ano, preco, cor } = req.body;
    const imagePath = req.file ? req.file.path : null;
    if (!marca || !modelo || !ano || !preco || !imagePath) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    db.run(
        'INSERT INTO Vehicles (marca, modelo, ano, preco, cor, image) VALUES (?, ?, ?, ?, ?, ?)',
        [marca, modelo, ano, preco, cor, imagePath],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({
                id: this.lastID,
                marca,
                modelo,
                ano,
                preco,
                cor,
                image: imagePath
            });
        }
    );
});


// Endpoint para atualizar um veículo existente
app.put('/vehicles/:id', (req, res) => {
    const { id } = req.params; // Extrair o ID dos parâmetros da URL
    const { marca, modelo, ano, preco, cor } = req.body; // Extrair os dados do corpo da requisição

    // Validar a entrada
    if (!marca || !modelo || !ano || !preco || !cor) {
        res.status(400).json({ message: 'Todos os campos obrigatórios (marca, modelo, ano, preco, cor) devem ser preenchidos!' });
        return;
    }

    db.run(
        'UPDATE Vehicles SET marca = ?, modelo = ?, ano = ?, preco = ?, cor = ? WHERE id = ?',
        [marca, modelo, ano, preco, cor, id],
        function (err) {
            if (err) {
                console.error(`Erro ao atualizar o veículo com o ID: ${id}:`, err);
                res.status(400).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Veículo não encontrado.' });
                return;
            }
            res.json({ message: `Veículo atualizado com o ID: ${id}` });
        }
    );
});

 

app.post('/users', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });
                res.json({ message: 'Usuário registrado com sucesso!', id: this.lastID });
            }
        );
    } catch (error) {
        console.error('Erro durante o registro do usuário:', error); // Log detalhado para erro no registro de usuário.
        res.status(500).json({ error: 'UserRegistrationError' });
    }
});


// Endpoint para atualizar usuário
app.put('/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // Atualizar apenas os campos fornecidos
    let updateFields = [];
    let updateValues = [];

    if (username) {
        updateFields.push("username = ?");
        updateValues.push(username);
    }
    if (email) {
        updateFields.push("email = ?");
        updateValues.push(email);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push("password = ?");
        updateValues.push(hashedPassword);
    }
    updateValues.push(id);

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'Nenhum campo para atualizar.' });
    }

    const query = `UPDATE Users SET ${updateFields.join(", ")} WHERE id = ?`;

    db.run(query, updateValues, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
        res.json({ message: 'Usuário atualizado com sucesso!' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas.' });

        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido!', token });
    });
});

app.get('/profile', authenticateToken, (req, res) => {
    const { id } = req.user;
    db.get('SELECT id, username, email, created_at FROM Users WHERE id = ?', [id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ user });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`O servidor está online na porta: ${PORT}`);
});