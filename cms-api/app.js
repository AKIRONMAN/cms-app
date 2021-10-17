const express = require('express');
const app = express();
const routes = require('./src/routes/index');
const sql = require('./src/services/sql-service');
const createAdmin = () => {
    try{
        const User = require('./src/models/User');
        sql.create({
            id: 1,
            firstName: 'Admin',
            lastName: 'item',
            email: 'admin@item.com',
            password: 'VTJGc2RHVmtYMS9vUTg0TUJ5TUd6anExRUxVZjR1RTFYYUMyM3YvYWQyVT0=',
            canDelete: 0,
            phone: '9909912121',
            about: 'This user is created on app starting this user cant be edited nor be delete.'
        }, 'users', User)
            .then((response) => {console.log('Admin::: created:::');});
    }catch(e){
        console.log('Error:::', e);
    }
}

createAdmin();
app.use(express.json());
//ROUTES
app.use('/apis', routes);

// error handler
app.use( (error, req, res, next) => {
  let message = {};
  if(error && error.message){
    message = JSON.parse(error.message); 
  } 

  res.status(500).send({
        error: {
        status: error.status || 500,
        message: {
          server: message.server || 'Internal Server Error Please Try Again Later!',
          custom: message.custom || 'Internal Server Error Please Try Again Later!'
        }
       }
    });
  });
//LISTEN 

app.listen(3000, console.log('Listening to PORT: 3000'));