

module.exports = (app, router, upload, appPath) => {
    const Submission = require('../models/Submission');
    const ProjectFile = require('../models/ProjectFile');

    router.use((req, res, next) => {
        console.log('/' + req.method);
        next();
    });

    const fs = require('fs');
    const uploadFolder = appPath + '/uploads/';
    

    
    
    

    app.post('/api/files/pfile/upload/:projId', upload.single('uploadfile'))


    
    app.get('/api/files/download/:filename', (req, res) => {
        res.download(uploadFolder + req.params.filename);
    });
    
    app.post('/api/files/upload/:taskId', upload.single('uploadfile'), (req, res) => {
        Submission.create({
            // sub_doc: req.file,
            sub_doc: fs.readFileSync(uploadFolder + req.file.filename),
            task_id: req.params.taskId,
            sub_name: req.file.filename
        }).then((newFile) => {
            
            //send new file
            res.send(newFile.sub_name);
        }).catch((err) => {
            console.log("problem: " + err);
            res.render('error');
            
        });
    });

    app.post('/api/files/upload/pfile/:projId', upload.single('uploadfile'), (req, res) => {
        ProjectFile.create({
            file: fs.readFileSync(uploadFolder + req.file.filename),
            file_name: req.file.filename,
            proj_id: req.params.projId
        }).then((newFile) => {
            res.send(newFile.file_name);
        }).catch(err => {
            console.log(err);
            res.render('error');
        });
    })



    const removeFilesFromStorage = () => {
        let path = appPath + '/uploads';
       
        fs.readdir(path, (err, files) => {
            if (err) {
                console.log(err);
            }
            files.forEach(file => {
                fs.unlink(uploadFolder+file, err => {
                    console.log("error with unlinking file from upload folder");
                });
            });
        });
        
            
        
    }
    
    
    
}