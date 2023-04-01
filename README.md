# ArBa Backend Server

An ecommerce websites server

## Authors

- [PrasadK05](https://github.com/PrasadK05)

## Frontend Repo

 
- [front end repo](https://github.com/PrasadK05/arba_frontend)
- [live](https://incomparable-kangaroo-c5ac82.netlify.app/)

## Tech Stack


**Server:** Node, Express, MongoDB

## API Reference

#### User Routes

```http
  POST /user/signup
  POST /user/login
  POST /user/get-otp
  POST /user/forgot-password
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fullName` | `string` | **Required**. for signup  |
| `userName` | `string` | **Required**.  for signup|
| `email` | `string` | **Required**.  for signup and login|
| `password` | `string` | **Required**. for signup and login|

##### remaining routes comming soon...
