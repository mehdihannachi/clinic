   module.exports = function(app, passport) {
       var chatController = require('./../controllers/chatController')
       var userController = require('./../controllers/userController.js')
       var testController = require('./../controllers/testController.js')


       app.post('/chat/new', chatController.startDiscussion);

       app.get('/chat/discussions/:id', chatController.getAllDiscussions);
       app.get('/chat/discussionsHistory/:id', chatController.getAllDiscussionsHistory);

       app.get('/chat/discussion/:id', chatController.getDiscussion);
       app.get('/chat/discussionHistory/:id', chatController.getDiscussionHistory);

       app.post('/chat/sendMessage/', userController.isLoggedIn,chatController.sendMsg);

       app.post('/chat/delete/:id', userController.isLoggedIn,chatController.delete);

       app.post('/chat/deleteSelected', userController.isLoggedIn,chatController.deleteSelected);
       
       app.post('/chat/seenOnMessages', userController.isLoggedIn,chatController.seenOnMessages);


       app.get('/chat/getAll', testController.getAllDiscussions);


   }
   