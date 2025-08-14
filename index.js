const express = require('express') 
const pkg = require('pg')
const cors = require('cors');
require('dotenv').config();

const { Pool } = pkg;
const app = express();
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/buscar', async (req, res) => {
  const { produto, cidade, estado } = req.query;
  let query = `
    SELECT f.nome, f.cnpj, f.telefone, f.email, f.cidade, f.estado, p.nome_produto
    FROM fornecedores f
    JOIN produtos p ON p.fornecedor_id = f.id
    WHERE p.nome_produto ILIKE $1
  `;
  const params = [`%${produto}%`];

  if (cidade) {
    query += ` AND f.cidade ILIKE $${params.length + 1}`;
    params.push(`%${cidade}%`);
  }
  if (estado) {
    query += ` AND f.estado ILIKE $${params.length + 1}`;
    params.push(`%${estado}%`);
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`API rodando na porta ${PORT}`));
