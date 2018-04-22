## Project Description
This project is an API server built using NodeJS + Express and written in TypeScript. The server persists data in a Mongo Database. Tests have been written for each of endpoints using Jest + supertest.

## Features
- The project implements CRUD endpoints for Users, Posts, and Comments.
- The server persists data in a Mongo Database.
- Tests validate all endpoints.

## Experience
Created an api server in TypeScript.
Created an object oriented structured code base that works elegantly.
Created TypeScript interfaces for classes.
Created adapter classes for Mongo Database collections.
Created validation for post body on endpoints.
Created helper functions that created routes when passed a route configuration object.
Created Jest tests for all routes in TypeScript.

## Models
```
Post { title, content, author }
```
```
User { username, email, about }
```
```
Comment { post, user, content }
```

## Rotues

```
1. GET /users - response: { status, data }
2. GET /users/:id - request: User, response: { status, data }
3. POST /users - request: User, response: { status, data }
4. PUT /users/:id - response: { status, data }
5. DELETE /users/:id - response: { status, data }
```
```
1. GET /posts - response: { status, data }
2. GET /posts/:id - request: Post, response: { status, data }
3. POST /posts - request: Post, response: { status, data }
4. PUT /posts/:id - response: { status, data }
5. DELETE /posts/:id - response: { status, data }
```
```
1. GET /comments - response: { status, data }
2. GET /comments/:id - request: Comment, response: { status, data }
3. POST /comments - request: Comment, response: { status, data }
4. PUT /comments/:id - response: { status, data }
5. DELETE /comments/:id - response: { status, data }
```