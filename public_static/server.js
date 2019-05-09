let Express = require('express');
let multer = require('multer');
let bodyParser = require('body-parser');
let app = Express();
let fs = require('fs');

let summarize = require ("text-summary");

let http = require('http').Server(app);
let io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log(socket.id);
});


app.use(Express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set("view engine", "ejs");
let Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "C:\\Users\\deepa\\Desktop\\HackDelhi\\public_static\\upload");
    },
    filename: function (req, file, callback) {
        callback(null, 'sample.' + file.originalname.split('.')[1]);
    }
});

let upload = multer({
    storage: Storage
}).array("imgUploader", 3); //Field name and max count
let i = 0;

app.post("/api/Upload", function (req, res) {

    i = i + 1;
    if (i === 1) {
        upload(req, res, function (err) {

            console.log('Processing the File!');
            let {
                PythonShell
            } = require('python-shell');

            let options = {
                mode: 'text',
                pythonPath: 'C:\\Users\\deepa\\Miniconda3\\python.exe',
                pythonOptions: ['-u'],
                scriptPath: 'C:\\Users\\deepa\\Desktop\\HackDelhi\\python'
            };

            // PythonShell.run('text_to_videobook.py', options, function (err, results) {
            //     if (err) throw err;
            //     else {
            //         console.log('results: %j', results);
            //         // return res.redirect('/videobook.html');
            //         return res.download('../python/sample.mp4')
            //     }

            // });

            let pyshell = new PythonShell('text_to_videobook.py', options);

            // sends a message to the Python script via stdin            
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                console.log(message);
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err, code, signal) {
                if (err) throw err;
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log('finished');
                // res.send('../python/sample.mp4');

                io.emit('complete', {msg: 'complete'});
                
                
            });

            if (err) {
                return res.end("Something went wrong!");
            }
            // return res.redirect('/videobook.html');



            return res.redirect('/loading.html');
        });
    }
});

app.get('/get_summary',(req,res)=>{
    let text =''
    fs.readFile('./upload/sample.txt','utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        text = data;    
        console.log('Text is : ',text);   

        let lines = data.split('.');
        let numberSentences = Math.ceil(lines.length / 2);
        console.log(numberSentences);
        let sum = summarize.summary(data, numberSentences);
        // console.log("Text type is : "+typeof(sum));
        console.log("Summary is: " + sum);
        res.send(sum);
    });
})

http.listen(2000, () => {
    console.log("Open http://localhost:2000");
    const fs = require('fs');
    const path = require('path');

    const directory = path.join(__dirname, '/upload');
    console.log("Directory is : " + directory);

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
        console.log("Deleting Redundant File!!!")
    });

})