export const UserValidationSchema = {
	username: 'string',
	email: 'string',
	about: 'string'
}

export const PostValidationSchema = {
	title: 'string',
	content: 'string',
	author: 'id'
}

export const CommentValidationSchema = {
	user: 'id',
	post: 'id',
	content: 'string',
}