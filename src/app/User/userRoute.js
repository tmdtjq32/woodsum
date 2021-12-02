module.exports = function (app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/test', user.test);

    app.get('/home', user.home);
    
    // JWT 검증 API
    app.get('/app/users/check', jwtMiddleware, user.check);

};
