const express = require('express')
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
// app.use(cors())

const port = 5000

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, __dirname + '/uploads');
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
      callback(null, 'video.mp4');
    }
    // Sets saved filename(s) to be original filename(s)
  })
  const upload = multer({ storage: storage })


  app.post("/upload", upload.array("file"), (req, res) => {
    // Sets multer to intercept files named "files" on uploaded form data
    
        console.log(req.body); // Logs form body values
        console.log(req.files); // Logs any files
        res.json({ message: "File(s) uploaded successfully" });
    });

   app.get('/convert',(req,res)=>{
    ffmpeg.setFfmpegPath(ffmpegStatic);

    // // Run FFmpeg0
    ffmpeg()
  
      // Input file
      .input('uploads/video.mp4')
  
      // Audio bit rate
      .outputOptions('-ab', '192k')
  
      // Output file
      .saveToFile('uploads/audio.mp3')
  
      // Log the percentage of work completed
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${Math.floor(progress.percent)}% done`);
        }
      })
  
      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        console.log("FFmpeg has finished")
        console.log(__dirname)
        // res.download('./audio.mp3')
      })
  
      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        console.error(error.message);
      });

      res.download(`${__dirname}/uploads/audio.mp3`)
   }) 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })