import mongoose from 'mongoose';

interface IPost {
	title: string,
	content: string,
	author: mongoose.Schema.Types.ObjectId
}

interface IPostMongooseModel extends IPost, mongoose.Document {}
// interface IPostMongooseModelStatic extends mongoose.Model<IPostMongooseModel> {}

const PostMongooseSchema: mongoose.Schema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxLength: 100,
		minLength: 3
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		requied: true,
		ref: 'User'
	},
	content: {
		type: String,
		required: true,
		maxLength: 1000,
		minLength: 1
	}
}, { versionKey: false });

// const PostMongooseModel = mongoose.model<IPostMongooseModel, IPostMongooseModelStatic>('Post', PostMongooseSchema);
const PostMongooseModel = mongoose.model<IPostMongooseModel>('Post', PostMongooseSchema);

export default PostMongooseModel;