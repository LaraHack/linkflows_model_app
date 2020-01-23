// code from https://github.com/aitchkhan/express-csv-download

// package use to transform json to csv string
const stringify = require('csv-stringify');
const posts = require('../posts.json');

module.exports = {
  downloadCsv
};

function downloadCsv(req, res) {
  // adding appropriate headers, so browsers can start downloading
  // file as soon as this request starts to get served
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  stringify(posts, { header: true })
    .pipe(res);
};
