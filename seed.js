const https = require('https');

const seeds = [
  { lat: 47.606, lng: -122.332, nickname: "Seattle Fan", message: "Always supporting Masaya! 💖🐯", imageUrl: "", timestamp: Date.now() },
  { lat: 33.518, lng: -86.810, nickname: "Birmingham Fan", message: "Always supporting Masaya! 💖🐯", imageUrl: "", timestamp: Date.now() },
  { lat: 35.710, lng: 139.810, nickname: "Japan Fan", message: "Always supporting Masaya! 💖🐯", imageUrl: "", timestamp: Date.now() }
];

function postData(url, data) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
      }
    };
    
    const req = https.request(url, options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    
    req.on('error', (e) => reject(e));
    req.write(dataString);
    req.end();
  });
}

async function run() {
  for (const seed of seeds) {
    const markerData = {
      lat: seed.lat,
      lng: seed.lng,
      message: seed.message,
      nickname: seed.nickname,
      timestamp: seed.timestamp,
      imageUrl: seed.imageUrl
    };
    
    const letterData = {
      nickname: seed.nickname,
      message: seed.message,
      country: "Map Submission",
      timestamp: seed.timestamp,
      imageUrl: seed.imageUrl,
      fromMap: true
    };
    
    await postData('https://masaya-usa-pinktiger-default-rtdb.firebaseio.com/mapMarkers.json', markerData);
    await postData('https://masaya-usa-pinktiger-default-rtdb.firebaseio.com/fanLetters.json', letterData);
    console.log(`Pushed data for ${seed.nickname}`);
  }
}

run();
