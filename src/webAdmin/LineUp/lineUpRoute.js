module.exports = function (app){
  const product = require('./lineUpController');
  
  app.get('/admin/line-up', product.getLineUp);
  app.post('/admin/line-up', product.uploadLineUp);
  app.delete('/admin/line-up/:id', product.deleteLineUp);
}