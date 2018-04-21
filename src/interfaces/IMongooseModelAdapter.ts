interface IRead {
	retrieve: (callback: (error: any, result: any) => void) => void;
	findById: (id: string, callback: (error: any, result: T) => void) => void;
	findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T>;
	find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
}
  
interface IWrite {
	create: (item: T, callback: (error: any, result: any) => void) => void;
	update: (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
	delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

interface IMongooseModelAdapter<T> extends IRead, IWrite {}

export default IMongooseModelAdapter;