import mysql, { Connection, QueryError } from 'mysql2';

const dbConfig = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'mysql',
	database: 'biblioteca'
};

const mysqlConnection: Connection = mysql.createConnection(dbConfig);

mysqlConnection.connect(async (err: QueryError | null) => {
	if (err) {
		console.error('Erro ao conectar ao banco de dados:', err);
		throw err;
	}
	console.log('Conexão bem-sucedida com o banco de dados MySQL');

	mysqlConnection.query('CREATE DATABASE IF NOT EXISTS biblioteca', (err) => {
		if (err) {
			console.error('Erro ao criar o banco de dados "biblioteca":', err);
			throw err;
		}
		console.log('Banco de dados "biblioteca" criado ou já existente.');

		mysqlConnection.changeUser({ database: 'biblioteca' }, (err) => {
			if (err) {
				console.error('Erro ao mudar para o banco "biblioteca":', err);
				throw err;
			}
			console.log('Agora usando o banco de dados "biblioteca"');
		});
	});
});

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

