
// const checkAuth = require('../middleware/check_auth');

module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    app.post('/api/signup', users.signupUser);

    app.post('/api/login', users.loginUser);

    app.get('/api/users', users.getUserListPaging);

    app.put('/api/userUpdate', users.userUpdateById);

    app.delete('/api/userDelete/:userId', users.userDeleteById);

}

