const { backups, initializeApp } = require('firestore-export-import')

const serviceAccount = require('./serviceAccountKey.json')

initializeApp(serviceAccount);

// TODO: dump to file
(async () => {
  const data = await backups();
  console.log(JSON.stringify(data));
})();
