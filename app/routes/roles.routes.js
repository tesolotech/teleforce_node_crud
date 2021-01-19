

module.exports = (app) => {
    const roles = require('../controllers/roles.controller.js');


    app.post('/api/createrole', roles.createRoles);

    app.get('/api/roleList', roles.GetAllRoles);

    app.delete('/api/role/:roleId', roles.deleteRoleById);

    app.put('/api/role', roles.UpdateRolesById);


}

