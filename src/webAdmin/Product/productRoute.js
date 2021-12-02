module.exports = function(app){
  const product = require('./productController');

  app.get('/admin/products', product.getProducts);
  app.get('/admin/products/:id', product.getProductDetail);
  app.post('/admin/products', product.uploadProducts);
  app.patch('/admin/products/:id', product.updateProduct);
  app.delete('/admin/products/:id', product.deleteProduct);
}