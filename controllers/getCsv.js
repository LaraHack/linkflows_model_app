// code from https://github.com/aitchkhan/express-csv-download

// package used to transform json to csv string
const csvParse = require('csv-parse');
const dataEditors = require('../data.csv');

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

  // stringify returns a readable stream that can be directly piped to a
  // writeable stream which is "res" (the response object)
  csvParse(dataEditors, { header: true })
    .pipe(res);
};
