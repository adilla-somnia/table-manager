require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

// // // config básica
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect(err => {
    if (err) {
        console.error('Erro de Conexão com DB:', err);
        return;
    }
    console.log('Conexão com o DB estabelecida para o Express.');
});

// // Rota GET / OK inicial
app.get('/', (req, res) => {
        res.json({status: 'OK', message:'Conected.'});
    });

//             // CUSTOMERS CUSTOMERS CUSTOMERS

// //  // GET GET GET
// todos os customers
app.get('/customers', (req, res) => {
    connection.query('SELECT * FROM customers', (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        res.json(results);
    });
});

// customers que tem reservas feitas (não poderão ser deletados enquanto as reservas existem)
app.get('/customers/restrict', (req, res) => {
    const query = 'SELECT DISTINCT customers.id FROM customers JOIN reservations r ON r.customer_id = customers.id';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        res.json(results);
    })
});

// retorna customer individual
app.get('/customers/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM customers WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        if (results.length === 0) {
            return res.status(404).send('ID não existe.');
        }
        res.json(results[0]);
    });
});

// // // POST

// adiciona customer
app.post('/customers', (req, res) => {
    const { name, phone, email } = req.body;

    const query = 'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?);';

    // retorna erro 400 caso nome ou telefone estejam vazios
    if (name == "") {
        return res.status(400).send("Nome é obrigatório!")
    }

    if (phone == "") {
        return res.status(400).send("Telefone é obrigatório!")
    }

    connection.query(query, [name, phone, email], (err, results) => {
        if (err) {
            console.error('Erro ao inserir autor:', err);
            return res.status(400).send('Não foi possível inserir cliente.')
        }
        res.status(201).json({
            message: 'Cliente inserido!',
            id: results.insertId
        });
    });
});

// // // PUT
// atualiza customer
app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    const query = 'UPDATE customers SET name = ?, phone = ?, email = ? WHERE id = ?';

    if (name == "") {
        return res.status(400).send("O nome não pode ficar em branco!")
    }
    if (phone == "") {
        return res.status(400).send("O telefone não pode ficar em branco!")
    }

    connection.query(query, [name, phone, email, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            return res.status(500).send('Erro ao atualizar cliente.');
        }
        if (results.affectedRows === 0) {
            return res.status(400).send('Cliente não encontrado.');
        }
        res.send('Cliente atualizado!')
    });
});

// // // DELETE
// delete customer
app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM customers WHERE id = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar cliente:', err);
            return res.status(500).send('Erro ao deletar cliente.');
        }
        if (results.affectedRows === 0) {
            return res.status(400).send('Cliente não encontrado.'); // erro 400 caso nenhuma linha tenha sido deletada
        }
        res.status(200).send('Cliente deletado.')
    });
});

// procura customer por telefone nome ou email
// rota adicional e não utilizada no front-end atualmente
app.get('/customer/search/', (req, res) => {
    const term = req.query.term;
    const searchFormatted = '%' + term.trim() + '%';

    const query = `SELECT * FROM customers WHERE (name LIKE ?) OR (phone LIKE ?) OR (email LIKE ?);`;

    connection.query(query, [searchFormatted, searchFormatted, searchFormatted],(err, results) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        if (results.length === 0) {
            return res.status(404).send('Cliente não encontrado.');
        }
        res.json(results);
    });
});

//             // TABLES TABLES TABLES
// // // GET
// retorna todas as tables
app.get('/tables', (req, res) => {
    const query = `SELECT * FROM tables;`

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar mesas:', err);
            return res.status(500).send('Erro interno do servidor.');
        }
        return res.json(results)
    });
});

// retorna tables com reservas, pra que não possam ser deletadas
app.get('/tables/restrict', (req, res) => {
    const query = 'SELECT DISTINCT tables.id FROM tables JOIN reservations r ON r.table_id = tables.id';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).send('Erro interno do servidor');
        }
        res.json(results);
    })
});

// retorna table
app.get('/tables/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM tables WHERE id = ?;`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar mesa:', err);
            return res.status(500).send('Erro interno do servidor.')
        }
        if (results.length === 0) {
            return res.status(200).send({"message": 'Mesa não existe.'})
        }
        return res.json(results[0])
    })
});

// // gerar sugestão de números (usada em POST/tables e PUT/tables)

// saber casa do número
function intLength(num) {
    if (!Number.isInteger(num)) {
        throw new Error("input must be an integer")
    }
    return Math.abs(num).toString().length;
}


// gerar sugestão
function gerarSugestoes(connection, quantidade = 3, tentativas = 0, callback) {
    if (tentativas > 10) return callback(new Error("Não foi possível gerar sugestões"));

    // ver qual o maior número para ajustar o range
    const maxNumQuery = `SELECT MAX(table_number) FROM tables`;

    connection.query(maxNumQuery, (err, maxNumber) => {
        if (err) {
            console.error('Erro ao achar maior table_number:', err)
            return res.status(500).send('Erro interno do servidor.')
        }
        let maxRange;

        if (maxNumber[0]['MAX(table_number)'] == null || maxNumber[0]['MAX(table_number)'] == 0) {
            maxRange = 9;
        } else {
            // adiciona 1 para que sempre haja mais números disponíveis para sugestões
            maxRange = Number('9'.repeat(1 + intLength(maxNumber[0]['MAX(table_number)'])))
        }

        const candidatos = [];
        // cria 50 candidatos com numeros aleatorios
        while (candidatos.length < 50) {
            candidatos.push(Math.floor(Math.random() * maxRange) + 1);
        }

        connection.query(
            "SELECT table_number FROM tables WHERE table_number IN (?)",
            [candidatos],
            (err, results) => {
            if (err) return callback(err);
            // set com table_numbers já utilizados (já existem em candidatos)
            const usados = new Set(results.map(r => r.table_number));
            // table_numbers que não estão em usados >> table_number disponíveis
            const livres = candidatos.filter(n => !usados.has(n));

            if (livres.length >= quantidade) {
                return callback(null, livres.slice(0, quantidade));
            }

            // tenta novamente sem travar o event loop
            gerarSugestoes(connection, quantidade, tentativas + 1, callback);
            }

            );
    })
}

// manda sugestões de table_numbers
app.get('/suggests', (req, res) => {
  gerarSugestoes(connection, 3, 0, (err, sugestoes) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao gerar sugestões" });
    }
    res.json(sugestoes);
  });
});

// verificar se o table_number está disponível
app.get('/check-number', (req, res) => {
  const number = parseInt(req.query.num);

  if (!number || number < 1 || number > 9999) {
    return res.json({ available: false, error: "Número inválido." });
  }

  connection.query(
    "SELECT table_number FROM tables WHERE table_number = ?",
    [number],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ available: false, error: "Erro de servidor" });
      }

      if (results.length > 0) {
        return res.json({ available: false });
      }

      return res.json({ available: true });
    }
  );
});

// // // POST
// adiciona table
app.post('/tables', (req, res) => {
    const { table_number, capacity } = req.body;

    if (table_number == "" || table_number === null)  {
        return res.status(400).send('Escolha um número de mesa!');
    }
    if (capacity <= 0) {
        return res.status(400).send('A capacidade dever ser maior do que 0!');
    }

    // verificar se mesa já existe
    const query_tables = `SELECT * FROM tables WHERE table_number = ?`;
    connection.query(query_tables, [table_number], (err, results) => {
        if (err) {
            console.error('Erro ao verificar mesa:', err);
            return res.status(500).send('Erro ao verificar mesa.');
        }
        if (results.length ==! 0) {
            return res.status(400).send('Esse número de mesa já existe! Escolha outro.');
        } else {
            // se não existir pode tentar inserir

            const query = `INSERT INTO tables (table_number, capacity) VALUES (?, ?);`;

            connection.query(query, [table_number, capacity], (err, results) => {
                if (err) {
                    console.error('Erro ao criar mesa:', err);
                    return res.status(500).send('Erro ao criar mesa.');
                }
                res.status(201).send('Mesa criada com sucesso!');
            });
        };
    });
});

// // // PUT
// atualiza table
app.put('/tables/:id', (req, res) => {
    const { id } = req.params;
    const { table_number, capacity, status } = req.body;

    if (!table_number) {
        return res.status(400).send('Número de mesa é obrigatório!');
    }
    if (capacity <= 0) {
        return res.status(400).send('A capacidade não pode ser maior que 0!');
    }

    // verificar se mesa existe
    const query_tables = `SELECT * FROM tables WHERE id = ?`;

    connection.query(query_tables, [id], (err, tableResult) => {
        if (err) {
            return res.status(500).send('Erro ao verificar mesa.');
        }
        if (tableResult.length === 0) {
            return res.status(400).send('Não existe mesa com esse ID!')
        }

        // verificar o número escolhido
        const query_tables = `SELECT * FROM tables WHERE table_number = ? AND id <> ?`;

        connection.query(query_tables, [table_number, id], (err, numberResult) => {
            if (err) {
                console.error('Erro ao verificar mesa:', err);
                return res.status(500).send('Erro ao verificar mesa.');
                }

            if (numberResult.length > 0) {
                return res.status(400).send('Esse número de mesa já existe! Escolha outro.');
                }

                // prosseguir com a atualização já que o numero esta disponivel
            const updateQuery = `UPDATE tables SET table_number = ?, capacity = ?, status = ? WHERE id = ?`;

            connection.query(updateQuery, [table_number, capacity, status, id], (err, updateResult) => {
            if (err) {
                console.error('Erro ao atualizar mesa:', err);
                return res.status(500).send('Erro ao atualizar mesa.');
                }
                if (updateResult.affectedRows === 0) {
                    return res.status(404).send('Mesa não existe.');
                }
                res.status(200).send('Mesa atualizada!');
            });
            })
        ;
    });
});

// // // DELETE
app.delete('/tables/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM tables WHERE id = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar mesa:', err);
            return res.status(500).send('Erro interno do servidor.');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Mesa não existe.');
        }
        res.status(200).send('Mesa deletada com sucesso!');
    })
})


// // search por status
// rota adicional e não utilizada no front-end atualmente
app.get('/table/status/', (req, res) => {
    const status = req.query.term;
    const options = new Array('ATIVA', 'INATIVA');

    if (!options.includes(status)) {
        return res.status(400).send('Tipo de status inválido.')
    }

    const query = 'SELECT * FROM tables WHERE status = ?';

    connection.query(query, [status], (err, results) => {
        if (err) {
            console.error('Erro ao buscar mesas:', err);
            return res.status(500).send('Erro interno do servidor.');
        }
        if (results.length === 0) {
            return res.status(404).send('Nenhuma mesa com esse status.');
        }
        res.json(results);
    });
});

// // search por capacity
// rota adicional e não utilizada no front-end atualmente
app.get('/table/capacity/', (req, res) => {
    const capacity = parseInt(req.query.num);

    if (!capacity || capacity < 1 || capacity > 9999) {
        return res.status(400).send('Número inválido.');
    }

    const query = 'SELECT * FROM tables WHERE capacity = ?';

    connection.query(query, [capacity], (err, results) => {
        if (err) {
            console.error('Erro ao buscar mesas:', err);
            return res.status(500).send('Erro interno do servidor.');
        }
        if (results.length === 0) {
            return res.status(404).send('Nenhuma mesa encontrada com essa capacidade.');
        }
        res.json(results);
    })
});

// // search por table_number
// rota adicional e não utilizada no front-end atualmente
app.get('/table/number', (req, res) => {
    const number = parseInt(req.query.num);

    const query = `SELECT * FROM tables WHERE table_number = ?;`;

    connection.query(query, [number], (err, results) => {
        if (err) {
            console.error('Erro ao buscar mesa:', err);
            return res.status(500).send('Erro interno do servidor.')
        }
        if (results.length === 0) {
            return res.status(200).send({"message": 'Mesa não existe.'})
        }
        return res.json(results)
    })
});


//          // RESERVATIONS

// // GET GET GET
// retorna todas as reservas
app.get('/reservations', (req, res) => {

    const query = `SELECT reservations.*, customers.name, tables.table_number FROM reservations JOIN customers ON customers.id = reservations.customer_id JOIN tables ON tables.id = reservations.table_id`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar reservas:', err);
            return res.status(500).send('Erro interno do servidor.')
        }
        return res.json(results);
    })
});

// retorna uma reserva
app.get('/reservations/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM reservations WHERE id = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar reserva:', err);
            return res.status(500).send('Erro interno do servidor.')
        }
        if (results.length === 0) {
            return res.status(400).send('Reserva não existe.')
        }
        return res.json(results[0]);
    });

});

// função básica pra validar data
function isValidDate(dateStr) {
    const regex = /^(19|20)\d{2}-(0[13578]|1[02])-(0[1-9]|[12]\d|3[01])$|^(19|20)\d{2}-(0[469]|11)-(0[1-9]|[12]\d|30)$|^(19|20)\d{2}-02-(0[1-9]|1\d|2[0-8])$|^((19|20)([02468][048]|[13579][26]))-02-29$/;
    return regex.test(dateStr);
}

// checa se a mesa está ocupada ou livre tal dia
// ex: /reservation-check/2?date=2025-01-02
app.get('/reservation-check/:table_id', (req, res) => {
    const { table_id } = req.params;
    const reservation_datetime = req.query.date;

    if (!table_id) return res.status(400).send('É obrigatório escolher uma mesa!');
    if (!isValidDate(reservation_datetime)) return res.status(400).send('Data inválida!');

        // 1. Verificar mesa
        const queryVerTable = `SELECT * FROM tables WHERE id = ?`;

        connection.query(queryVerTable, [table_id], (err, result) => {
            if (err) return res.status(500).send('Erro ao verificar mesa.');
            if (result.length === 0) return res.status(400).send('Mesa não existe!');

            // 2. Verificar se mesa está ocupada
            const queryTable = `
                SELECT * FROM reservations
                WHERE table_id = ?
                AND status IN ('PENDENTE', 'CONFIRMADA')
                AND DATE(reservation_datetime) = ?
            `;
            
            connection.query(queryTable, [table_id, reservation_datetime], (err, results) => {
                if (err) return res.status(500).send('Erro ao verificar reserva.');
                if (results.length === 0) {
                    return res.json({available: true});
                }

                       // 3. mesa está ocupada. então vamos gerar sugestões
                    const queryMesasDisponiveis = `
                        SELECT t.table_number
                        FROM tables t
                        LEFT JOIN reservations r
                          ON r.table_id = t.id
                          AND DATE(r.reservation_datetime) = ?
                          AND r.status IN ('PENDENTE', 'CONFIRMADA')
                        WHERE r.table_id IS NULL
                        LIMIT 3
                    `;

                    const queryDatasDisponiveis = `
                        SELECT d.date
                        FROM calendar_dates d
                        LEFT JOIN reservations r
                          ON r.table_id = ?
                          AND DATE(r.reservation_datetime) = d.date
                          AND r.status IN ('PENDENTE','CONFIRMADA')
                        WHERE d.date >= ?
                          AND r.table_id IS NULL
                        LIMIT 1
                    `;

                    connection.query(queryMesasDisponiveis, [reservation_datetime], (err1, mesasDisponiveis) => {
                        if (err1) return res.status(500).send('Erro ao buscar mesas disponíveis.');

                        connection.query(queryDatasDisponiveis, [table_id, reservation_datetime], (err2, datasDisponiveis) => {
                            if (err2) return res.status(500).send('Erro ao buscar datas disponíveis.');

                            return res.json({
                                available: false,
                                message: 'Essa mesa já está reservada para esse dia.',
                                suggestions: {
                                    tables: mesasDisponiveis.map(r => r.table_number),
                                    date: datasDisponiveis.length ? datasDisponiveis[0].date : null
                                }
                            });
                        });
                    });
                })})

});

// // filter de acordo com reservation dates a partir de, antes de, igual a
// rota adicional não utilizada no front-end atualmente
app.get('/reservation/date', (req, res) => {
    const full_date = req.query.num;
    const options = new Array('AFT', 'BEF', 'EQL')

    // reservation/date?num=AFR2025-10-02
    const option = full_date.slice(0,3);
    if (!options.includes(option)) {
        return res.status(400).send('Opção inválida!')
    }

    const date = full_date.slice(3, 13)

    if (!isValidDate(date)) {
        return res.status(400).send('Insira uma data válida!')
    }

    let query;

    if (option === options[0]) {
        query = `SELECT * FROM reservations WHERE reservation_datetime > ?`;
    }
    else if (option === options[1]) {
        query = `SELECT * FROM reservations WHERE reservation_datetime < ?`;
    } else if (option === options[2]) {
        query = `SELECT * FROM reservations WHERE reservation_datetime = ?`;
    }

    connection.query(query, [date], (err, results) => {
        if (err) {
            console.error('Erro ao buscar reserva:', err);
            return res.status(500).send('Erro interno do servidor.')
        }
        if (results.length === 0) {
            return res.status(400).send('Reserva não existe.')
        }
        return res.json(results);
    });
});

// adicionar reserva
app.post('/reservations', (req, res) => {
    const { customer_id, table_id, reservation_datetime } = req.body;

    if (!customer_id) return res.status(400).send('É obrigatório escolher um cliente!');
    if (!table_id) return res.status(400).send('É obrigatório escolher uma mesa!');
    if (!isValidDate(reservation_datetime)) return res.status(400).send('Insira uma data válida!');

    // 1. Verificar cliente
    const queryVerCustomer = `SELECT * FROM customers WHERE id = ?`;

    connection.query(queryVerCustomer, [customer_id], (err, result) => {
        if (err) return res.status(500).send('Erro ao verificar cliente.');
        if (result.length === 0) return res.status(400).send('Cliente não existe!');

        // 2. Verificar mesa
        const queryVerTable = `SELECT * FROM tables WHERE id = ?`;

        connection.query(queryVerTable, [table_id], (err, result) => {
            if (err) return res.status(500).send('Erro ao verificar mesa.');
            if (result.length === 0) return res.status(400).send('Mesa não existe!');

            // 3. Verificar se mesa está ocupada
            const queryTable = `
                SELECT * FROM reservations
                WHERE table_id = ?
                AND status IN ('PENDENTE', 'CONFIRMADA')
                AND DATE(reservation_datetime) = ?
            `;

            connection.query(queryTable, [table_id, reservation_datetime], (err, results) => {
                if (err) return res.status(500).send('Erro ao verificar reserva.');

                if (results.length > 0) {
                    // 4. mesa ocupada → gerar sugestões
                    const queryMesasDisponiveis = `
                        SELECT t.table_number
                        FROM tables t
                        LEFT JOIN reservations r
                          ON r.table_id = t.id
                          AND DATE(r.reservation_datetime) = ?
                          AND r.status IN ('PENDENTE', 'CONFIRMADA')
                        WHERE r.table_id IS NULL
                        LIMIT 3
                    `;

                    const queryDatasDisponiveis = `
                        SELECT d.date
                        FROM calendar_dates d
                        LEFT JOIN reservations r
                          ON r.table_id = ?
                          AND DATE(r.reservation_datetime) = d.date
                          AND r.status IN ('PENDENTE','CONFIRMADA')
                        WHERE d.date >= ?
                          AND r.table_id IS NULL
                        LIMIT 1
                    `;

                    connection.query(queryMesasDisponiveis, [reservation_datetime], (err1, mesasDisponiveis) => {
                        if (err1) return res.status(500).send('Erro ao buscar mesas disponíveis.');

                        connection.query(queryDatasDisponiveis, [table_id, reservation_datetime], (err2, datasDisponiveis) => {
                            if (err2) return res.status(500).send('Erro ao buscar datas disponíveis.');

                            return res.status(400).json({
                                message: 'Essa mesa já está reservada para esse dia.',
                                suggestions: {
                                    tables: mesasDisponiveis.map(r => r.table_number),
                                    date: datasDisponiveis.length ? datasDisponiveis[0].date : null
                                }
                            });
                        });
                    });
                    return;
                }

                // 5. Mesa está livre. vamos criar a reserva
                const queryInsert = `
                    INSERT INTO reservations (customer_id, table_id, reservation_datetime)
                    VALUES (?, ?, ?)
                `;

                connection.query(queryInsert, [customer_id, table_id, reservation_datetime], (err3, resultInsert) => {
                    if (err3) return res.status(500).send('Erro ao criar reserva.');

                    return res.status(201).json({
                        message: 'Reserva criada',
                        id_reserva: resultInsert.insertId
                    });
                });
            });
        });
    });
});

// PUT PUT PUT
// atualiza reserva
app.put('/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { customer_id, table_id, reservation_datetime, status } = req.body;
    const options = new Array('PENDENTE', 'CONFIRMADA', 'CANCELADA');

    if (!customer_id) return res.status(400).send('É obrigatório ter um cliente!');
    if (!table_id) return res.status(400).send('É obrigatório ter uma mesa!');
    if (!reservation_datetime) return res.status(400).send('É obrigatório escolher uma data!');
    if (!isValidDate(reservation_datetime.slice(0,10))) return res.status(400).send('Insira uma data válida!');
    if (!options.includes(status)) return res.status(400).send('Insira um status válido!');

    const dataLimpa = reservation_datetime.slice(0,10);

    // 1. Verificar cliente
    connection.query(`SELECT * FROM customers WHERE id = ?`, [customer_id], (err, r1) => {
        if (err) return res.status(500).send('Erro ao verificar cliente.');
        if (r1.length === 0) return res.status(400).send('Cliente não existe!');

        // 2. Verificar mesa
        connection.query(`SELECT * FROM tables WHERE id = ?`, [table_id], (err, r2) => {
            if (err) return res.status(500).send('Erro ao verificar mesa.');
            if (r2.length === 0) return res.status(400).send('Mesa não existe!');

            // 3. Verificar se reserva existe
            connection.query(`SELECT * FROM reservations WHERE id = ?`, [id], (err, r3) => {
                if (err) return res.status(500).send('Erro ao verificar reserva.');
                if (r3.length === 0) return res.status(400).send('Não existe reserva com esse ID.');

                // 4. Verificar se mesa está ocupada na mesma data
                const queryTable = `
                    SELECT * FROM reservations
                    WHERE table_id = ?
                    AND status IN ('PENDENTE', 'CONFIRMADA')
                    AND DATE(reservation_datetime) = ?
                    AND id <> ?
                `;

                connection.query(queryTable, [table_id, dataLimpa, id], (err, ocupadas) => {
                    if (err) return res.status(500).send('Erro ao verificar mesa.');

                    if (ocupadas.length > 0) {
                        // 5. Gerar sugestões
                        const queryMesasDisponiveis = `
                            SELECT t.table_number
                            FROM tables t
                            LEFT JOIN reservations r
                              ON r.table_id = t.id
                              AND DATE(r.reservation_datetime) = ?
                              AND r.status IN ('PENDENTE', 'CONFIRMADA')
                            WHERE r.table_id IS NULL
                            LIMIT 3
                        `;

                        const queryDatasDisponiveis = `
                            SELECT d.date
                            FROM calendar_dates d
                            LEFT JOIN reservations r
                              ON r.table_id = ?
                              AND DATE(r.reservation_datetime) = d.date
                              AND r.status IN ('PENDENTE','CONFIRMADA')
                            WHERE d.date >= ?
                              AND r.table_id IS NULL
                            LIMIT 1
                        `;

                        connection.query(queryMesasDisponiveis, [dataLimpa], (err1, mesas) => {
                            if (err1) return res.status(500).send('Erro ao buscar mesas disponíveis.');

                            connection.query(queryDatasDisponiveis, [table_id, dataLimpa], (err2, datas) => {
                                if (err2) return res.status(500).send('Erro ao buscar datas disponíveis.');

                                return res.status(400).json({
                                    message: 'Essa mesa já está reservada para esse dia.',
                                    suggestions: {
                                        tables: mesas.map(r => r.table_number),
                                        date: datas[0]?.date.toISOString().slice(0,10) || null
                                    }
                                });
                            });
                        });

                        return; // impede de continuar o fluxo
                    }

                    // 6. Mesa disponível. vamos atualizar então
                    const update = `
                        UPDATE reservations
                        SET customer_id = ?, table_id = ?, reservation_datetime = ?, status = ?
                        WHERE id = ?
                        AND (
                            customer_id <> ? OR
                            table_id <> ? OR
                            reservation_datetime <> ? OR
                            status <> ?
                        )
                    `;

                    connection.query(update, [
                        customer_id, table_id, dataLimpa, status,
                        id,
                        customer_id, table_id, dataLimpa, status
                    ], (err4, result) => {
                        if (err4) return res.status(500).send('Erro ao atualizar reserva.');

                        if (result.affectedRows === 0) return res.status(200).send('Nenhum campo atualizado.');
                        return res.status(200).json({ message: 'Reserva atualizada!' });
                    });
                });
            });
        });
    });
});



// // DEL DEL DEL
// deletar reserva
app.delete('/reservations/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM reservations WHERE id = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao deletar reserva:', err);
            return res.status(500).send('Erro interno do servidor.')
        }
        if (results.affectedRows === 0) {
            return res.status(400).send('Reserva não existe.');
        }
        res.send('Reserva deletada!')
    })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});