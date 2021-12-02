module.exports = function(app){
  const contentController = require("./contentController");

  app.get('/admin/contents', contentController.getCategory);
  app.get('/admin/contents/:id', contentController.getCategoryDetail);
  app.post('/admin/contents', contentController.uploadCategory);
  app.patch('/admin/contents/:id', contentController.updateCategory);
  app.delete('/admin/contents/:id', contentController.deleteCategory);
}