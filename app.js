var API = new require('./api').API();
var Scraper = new require('./scraper').Scraper();

setInterval(Scraper.start, 60000);
API.start();