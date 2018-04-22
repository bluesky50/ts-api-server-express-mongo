import mongoose from 'mongoose';

interface IComment {
	post: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	content: string,
}

interface ICommentMongooseModel extends IComment, mongoose.Document {}
// interface ICommentMongooseModelStatic extends mongoose.Model<ICommentMongooseModel> {}

const CommentMongooseSchema: mongoose.Schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		requied: true,
		ref: 'Post'
	},
	content: {
		type: String,
		required: true,
		minLength: 1,
		maxLength: 360
	}
}, { versionKey: false });

// const CommentMongooseModel = mongoose.model<ICommentMongooseModel, ICommentMongooseModelStatic>('Comment', CommentMongooseSchema);
const CommentMongooseModel = mongoose.model<ICommentMongooseModel>('Comment', CommentMongooseSchema);

export default CommentMongooseModel;