module.exports = function (app) {
    const user = require('./productController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/product/:idx', user.product);

    app.get('/category', user.category);

    // JWT 검증 API
    app.get('/app/users/check', jwtMiddleware, user.check);

};