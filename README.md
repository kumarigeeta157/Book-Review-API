# Book-Review-API

Features 
JWT - based user authentication 
add and search books
submit , update , and delete reviews
Pagination & filtering 


Tech Stack 
Nodejs, Express.js , MYSQL , JWT for authentication , dotenv for environment configuration 

setup
npm install 
npm install express mysql jsonwebtoken bcryptjs dotenv cors

Assumptions & Design
Only authenticated users can add books and reviews
One review per user per book
Partial, case-insensitive search for books
Average rating calculated using SQL aggregate functions
Modular structure (routes, controllers, models)



