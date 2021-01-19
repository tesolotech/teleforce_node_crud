

module.exports = (app) => {
    const customers = require('../controllers/customers.controller.js');

    app.post('/api/createCustomer', customers.createCustomer);

    app.get('/api/customers', customers.GetAllCustomer);

    app.put('/api/customerUpdate', customers.customerUpdateById);

    app.delete('/api/customerDelete/:customerId', customers.customerDeleteById);


}

