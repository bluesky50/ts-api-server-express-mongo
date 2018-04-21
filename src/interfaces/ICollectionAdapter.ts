interface IRead {
	// retrieve: (callback: (error: any, result: any) => void) => void;
	// findById: (id: string, callback: (error: any, result: T) => void) => void;
	// findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T>;
	// find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
}
  
interface IWrite {
	// create: (item: T, callback: (error: any, result: any) => void) => void;
	// update: (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
	// delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

interface ICollectionAdapter {
	retrieve(populateConfig?: object, sortConfig?: object, limitConfig?: object): any;
	find(queryConfig?: object, populateConfig?: object, sortConfig?: object, limitConfig?: object): any;
	findById(id: string, populateConfig?: object): any;
	findOne(queryConfig?: object, populateConfig?: object): any;
	create(item: object): any;
	// createMany(items: object[]): any;
	updateById(id: string, item: any, populateConfig?: object): any;
	removeById(id: string, populateConfig?: object): any
	// removeById(id: string, populateConfig?: object): Promise<T>
}

export default ICollectionAdapter;