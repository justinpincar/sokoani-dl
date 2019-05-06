const axios = require('axios');
const cheerio = require('cheerio');
const download = require('download');

START_PAGE = 59;
END_PAGE = 1;


const main = async () => {
  for (let i = START_PAGE; i >= END_PAGE; i -= 1) {
    console.log(`Processing results page: ${i}`);

    const articleUrls = [];

    const pageUrl = `https://sokoani.com/sokoani/page/${i}`;

    const page = await axios.get(pageUrl);
    const pageData = page.data;
    const $ = cheerio.load(pageData);

    $('a.entry-title-link').each(function (i, elem) {
      articleUrls.push($(this).attr('href'));
    });

    const promises = [];

    for (let i = 0; i < articleUrls.length; i += 1) {
      const article = await axios.get(articleUrls[i]);
      const $ = cheerio.load(article.data);

      const mp3Url = $("a[href*='.mp3']").attr('href');
      if (!mp3Url) {
        continue;
      }
      console.log(`Will download: ${mp3Url}`);
      promises.push(download(mp3Url, 'mp3s'));
    }

    await Promise.all(promises);
  }
}

main();
