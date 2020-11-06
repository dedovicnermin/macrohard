

module.exports = (app, router, upload, appPath) => {
    const Submission = require('../models/Submission');

    router.use((req, res, next) => {
        console.log('/' + req.method);
        next();
    });

    const fs = require('fs');
    const uploadFolder = appPath + '/uploads/';

    const listAllFiles = (req, res) => {
        fs.readdir(uploadFolder, (err, files) => {
            if (err) {
                console.log("error within listAllFiles");
                res.send("error: " + err);
            }
            res.send(files);
        });
    }
    app.get("/api/files/listfiles", (req, res) => {
        listAllFiles(req, res);
    });
    
    
    
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