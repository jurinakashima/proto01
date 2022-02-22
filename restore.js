const { restore, initializeApp } = require('firestore-export-import')

const serviceAccount = require('./serviceAccountKey.json')

initializeApp(serviceAccount);

// Start exporting your data
(async () => {
  await restore('data.json');
})();
