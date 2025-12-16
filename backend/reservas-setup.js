const mysql = require('mysql2');

const serverConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    multipleStatements: true
};

const dbName = 'restaurante_db';

const dbConfig = { ...serverConfig, database: dbName};

const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${dbName}`

// CREATE TABLE calendar_dates (
//   id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único para cada data
//   date DATE NOT NULL                  -- A coluna de data
// );

// INSERT INTO calendar_dates (date)
// SELECT CURDATE() + INTERVAL a DAY
// FROM (
//   SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
//   UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 
//   UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 
//   -- Você pode continuar até o número de dias que você precisar
// ) AS numbers
// WHERE CURDATE() + INTERVAL a DAY <= '2025-12-31';

const createTableQuery = `
    USE restaurante_db;
    -- CLIENTES (OBRIGATÓRIO)
    CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    -- MESAS (OBRIGATÓRIO)
    CREATE TABLE IF NOT EXISTS tables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_number INT NOT NULL UNIQUE,
        capacity INT NOT NULL,
        status ENUM('ATIVA', 'INATIVA') DEFAULT 'ATIVA',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    -- RESERVAS (BÔNUS)
    CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        table_id INT NOT NULL,
        reservation_datetime DATETIME NOT NULL,
        status ENUM('PENDENTE', 'CONFIRMADA', 'CANCELADA') DEFAULT 'PENDENTE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_res_customer FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_res_table FOREIGN KEY (table_id)
        REFERENCES tables(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
        ) ENGINE=InnoDB;
`;

const initialConnection = mysql.createConnection(serverConfig);

initialConnection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao server:', err);
        console.log('Certifique-se que o mysqld.exe está em execução.');
        return;
    }
    console.log('Conectado ao MySQL Server!');

    initialConnection.query(createDbQuery, (err, results) => {
        initialConnection.end();

        if (err) {
            console.error(`Erro ao criar/verificar o banco de dados ${dbName}:`, err);
            return;
        }

        console.log(`Banco de dados ${dbName} criado/verificado!`);

        const dbConnection = mysql.createConnection(dbConfig);

        dbConnection.connect(dbErr => {
            if (dbErr) {
                console.error(`Erro ao conectar ao banco de dados ${dbName}:`, dbErr);
                return;
            }

            dbConnection.query(createTableQuery, (tableErr, tableResults) => {
                dbConnection.end();

                if (tableErr) {
                    console.error(`Erro ao criar as tabelas:`, tableErr);
                    return;
                }

                console.log('Iniciatlização COMPLETA.')
            })
        })
    })
})