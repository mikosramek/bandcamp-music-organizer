'use strict';

const fs = require('fs');

const BASEPATH = './music';

const getFiles = (folderPath) => {
  return new Promise((res, rej) => {
    fs.readdir(folderPath, (err, files) => {
      if(err) rej(err);
      res(files);
    })
  })
}

const sortFiles = (files) => {
  return new Promise((res, rej) => {
    const fileMap = {};
    files.forEach(file => {
      const splitName = file.split('-');
      if(splitName.length < 3) return;
      const artist = splitName[0].trim();
      const album = splitName[1].trim();
      const trackName = splitName[2].trim();
      
      if(!fileMap[artist]){
        fileMap[artist] = {};
      }
      if(!fileMap[artist][album]){
        fileMap[artist][album] = [];
      }
      fileMap[artist][album].push({ name:trackName, filePath:file });
    })
    res(fileMap);
  })
}

const moveFiles = (fileMap) => {
  for(let [artistName, albums] of Object.entries(fileMap)){

    const artistPath = `${BASEPATH}/${artistName}`

    fs.mkdir(artistPath, () => {
      
      for(let [albumName, tracks] of Object.entries(albums)){

        const albumPath = artistPath + `/${albumName}`

        fs.mkdir(albumPath, () => {
          tracks.forEach(track => {
            fs.rename(`${BASEPATH}/${track.filePath}`, albumPath+'/'+track.name, () => {})
          })
        })
      }
    })
  }
}

/* 
{
  artist : {
    album : [track1, track2]
  },
} 
*/

const app = () => {
  getFiles(BASEPATH)
    .then(sortFiles).catch(console.log)
    .then(moveFiles).catch(console.log);
}

app();