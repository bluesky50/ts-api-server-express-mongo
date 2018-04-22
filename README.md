## Project Description
This project is an API server built using NodeJS + Express and written in TypeScript. The server persists data in a Mongo Database. Tests have been written for each of endpoints using Jest + supertest.

## Features
The project implements CRUD endpoints for Users, Posts, and Comments.
The server persists data in a Mongo Database.
Tests validate all endpoints.

## Models
Post { title, content, author }
User { username, email, about }
Comment { post, user, content }

## Experience
Created an api server in TypeScript.
Created an object oriented structured code base that works elegantly.
Created TypeScript interfaces for classes.
Created adapter classes for Mongo Database collections.
Created validation for post body on endpoints.
Created helper functions that created routes when passed a route configuration object.
Created Jest tests for all routes in TypeScript.