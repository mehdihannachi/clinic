    module.exports = function(app, passport) {
        var userController = require('./../controllers/userController.js')


        app.get('/users', userController.isLoggedIn, userController.index);

        app.post('/users/nurse', userController.isLoggedIn, userController.isAdmin,userController.newNurse);
        
        app.get('/users/nurses', userController.isLoggedIn, userController.nurses);

        app.post('/users/doctor', userController.isLoggedIn, userController.isAdmin, userController.newDoctor);
        
        app.post('/users/patient', userController.newPatient);
        
        app.post('/users/admin', userController.isLoggedIn, userController.isAdmin, userController.newAdmin);
        
        app.post('/users/delete', userController.isLoggedIn, userController.delete);
        
        app.post('/calender-save', userController.isLoggedIn, userController.savecalendar);
        
        
        app.post('/uploadFiles/:userid', userController.isLoggedIn, userController.uploadFiles);
        app.post('/removeFile/:userid', userController.isLoggedIn,  userController.removeFile);
        
               
        
        app.get('/calender-get', userController.isLoggedIn, userController.getcalendar);
        
        app.get('/user/profile/:id', userController.isLoggedIn, userController.userProfile);
        
        app.get('/user/admin/:id', userController.isLoggedIn,  userController.isAdmin, userController.adminProfile);
        app.get('/user/doctor/:id',userController.isLoggedIn, userController.doctorProfile);
        app.get('/user/nurse/:id',userController.isLoggedIn, userController.nurseProfile);
        app.get('/user/patient/:id', userController.isLoggedIn, userController.patientProfile);
        
        app.post('/user/admin/:id', userController.isLoggedIn, userController.isAdmin,userController.adminUpdate);
        app.post('/user/doctor/:id', userController.isLoggedIn, userController.isAdmin,userController.doctorUpdate);
        app.post('/user/nurse/:id', userController.isLoggedIn, userController.nurseUpdate);
        app.post('/user/patient/:id', userController.patientUpdate);
        
        app.delete('/user/admin/:id', userController.isLoggedIn, userController.isAdmin,userController.adminDelete);
        app.delete('/user/doctor/:id', userController.isLoggedIn,userController.isAdmin, userController.doctorDelete);
        app.delete('/user/nurse/:id',userController.isLoggedIn,userController.isAdmin, userController.nurseDelete);
        app.delete('/user/patient/:id', userController.isLoggedIn, userController.patientDelete);
        
        app.post('/rdv-demand', userController.isLoggedIn, userController.create_rdvDemand);
        
        app.get('/get-rdv-demands', userController.isLoggedIn, userController.get_rdvDemands);
        app.delete('/rdv-demand/:id', userController.isLoggedIn, userController.deleteRdvDemand);
        app.post('/rdv-demands', userController.isLoggedIn, userController.deleteSelectedRdvDemand);
        app.post('/update/rdv-demand/:id', userController.isLoggedIn, userController.updateRdvDemand);
        
        
        app.get('/isLoggedIn2', userController.isLoggedIn2)
        
        app.post('/contact-fertillia', userController.sendEmail)

        /*app.get('/news/:page', newsController.index);
        app.post('/news/delete/:id', newsController.delete);

        app.post('/news/update/:id', newsController.update);

        app.post('/news/draftUpdate/:id', newsController.publishDraft);

        app.post('/news/draft', newsController.saveDraft);
        app.post('/news/add', newsController.create);*/
    }
    