interface IDatabase {
	connect(): void;
	getConnection(): any;
}

export default IDatabase;