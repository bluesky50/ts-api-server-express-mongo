import mongoose from 'mongoose';

interface IUser {
	username: string,
	email: string,
	about: string,
}

interface IUserMongooseModel extends IUser, mongoose.Document {}
// interface IUserMongooseModelStatic extends mongoose.Model<IUserMongooseModel> {}

const UserSchema: mongoose.Schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 6
	},
	email: {
		type: String,
		requied: true,
		unique: true,
		minLength: 4,
	},
	about: {
		type: String,
		required: false,
		default: ''
	}
}, { versionKey: false });

// const UserMongooseModel = mongoose.model('User', UserSchema);
// const UserMongooseModel = mongoose.model<IUserMongooseModel, IUserMongooseModelStatic>('User', UserSchema);
const UserMongooseModel = mongoose.model<IUserMongooseModel>('User', UserSchema);

export default UserMongooseModel;