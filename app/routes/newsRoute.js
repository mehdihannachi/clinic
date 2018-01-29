    module.exports = function(app, passport) {
        var newsController = require('./../controllers/newsController')
        var userController = require('./../controllers/userController.js')

        app.get('/news/article/:id', newsController.show);

        app.get('/news', userController.isLoggedIn, newsController.index);

        app.post('/news/delete/:id', userController.isLoggedIn,  newsController.delete);

        app.post('/news/update/:id', userController.isLoggedIn,  newsController.update);

        app.post('/news/draftUpdate/:id', userController.isLoggedIn, newsController.publishDraft);
        
        app.post('/news/draft', userController.isLoggedIn, newsController.saveDraft);

        app.post('/news/add', userController.isLoggedIn, newsController.create);

        app.post('/news/many/delete', userController.isLoggedIn, newsController.deleteSelected);

        app.post('/news/many/draft',userController.isLoggedIn, newsController.draftSelected);

        app.get('/paginate/:currentPage', userController.isLoggedIn, newsController.paginate);
        
        app.get('/news/published', newsController.showPublished);
    }
    