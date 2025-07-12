import mysql, { Connection, QueryError } from 'mysql2';

const dbConfig = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'mysql'
};

let mysqlConnection: Connection = mysql.createConnection(dbConfig);

export async function initDatabase(): Promise<Connection> {
	return new Promise((resolve, reject) => {
		mysqlConnection = mysql.createConnection(dbConfig);

		mysqlConnection.connect((err: QueryError | null) => {
			if (err) {
				console.error('Erro ao conectar ao banco de dados:', err);
				return reject(err);
			}
			console.log('Conectado ao MySQL com sucesso.');

			mysqlConnection.query('CREATE DATABASE IF NOT EXISTS livraria', (err) => {
				if (err) {
					console.error('Erro ao criar o banco de dados:', err);
					return reject(err);
				}
				console.log('Banco de dados "livraria" criado ou já existente.');

				mysqlConnection.changeUser({ database: 'livraria' }, (err) => {
					if (err) {
						console.error('Erro ao mudar de banco:', err);
						return reject(err);
					}
					console.log('Usando banco de dados "livraria"');
					resolve(mysqlConnection);
				});
			});
		});
	});
}


export function executarComandoSQL(
	query: string,
	valores: any[],
	callback: (err: any, result: any) => void
) {
	mysqlConnection.query(query, valores, (err, resultado: any) => {
		if (err) {
			console.error('Erro ao executar a query:', err);
			throw err;
		}
		return callback(null, resultado);
	});
}

export function executarComandoSQLAsync(query: string, valores: any[]): Promise<any> {
	return new Promise((resolve, reject) => {
		mysqlConnection.query(query, valores, (err, resultado) => {
			if (err) {
				console.error('Erro ao executar a query:', err);
				reject(err);
			} else {
				resolve(resultado);
			}
		});
	});
}

