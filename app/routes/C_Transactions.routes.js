

module.exports = (app) => {
    const C_Transactions = require('../controllers/C_Transactions.controller.js');

    app.post('/api/createC_Transactions', C_Transactions.createCTransaction);

    app.get('/api/C_Transactions', C_Transactions.GetAllCTransaction);

    app.put('/api/CTransactionUpdate', C_Transactions.CTransactionUpdateById);

    app.delete('/api/CTransactionDelete/:CTransactionId', C_Transactions.CTransactionDeleteById);

    app.get('/api/C_Transactions/:customerId', C_Transactions.GetCustomerTransaction);

    // YYYY-MM-DD
    app.get('/api/C_Transactions/:date', C_Transactions.GetAllTransactionByDate);



}

