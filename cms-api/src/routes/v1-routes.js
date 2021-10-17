const routes  = require('express').Router();

const user = require('./user');
const category = require('./category');
const customer = require('./customer');

routes.use('/users', user);
routes.use('/categories', category);
routes.use('/customers', customer);

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected To ABONLINE V1 api!' });
  });

module.exports = routes;
