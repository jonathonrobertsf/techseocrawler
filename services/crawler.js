const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

async function crawlSinglePage(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const issues = [];

        if (!$('title').text()) issues.push('Missing <title>');
        if ($('meta[name="description"]').length === 0) issues.push('Missing meta description');
        if ($('link[rel="canonical"]').length === 0) issues.push('Missing canonical tag');
        if ($('h1').length === 0) issues.push('Missing <h1> tag');

        return { url, issues };
    } catch (err) {
        return { url, issues: [`Error: ${err.message}`] };
    }
}

async function crawlMultiplePages(baseUrl, count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const url = `${baseUrl}/page/${i + 1}`;
        const result = await crawlSinglePage(url);
        results.push(result);
    }
    return results;
}

async function crawlSitemap(sitemapUrl) {
    try {
        const { data } = await axios.get(sitemapUrl);
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(data);
        const urls = result.urlset.url.map(u => u.loc[0]);
        const results = [];
        for (let url of urls) {
            results.push(await crawlSinglePage(url));
        }
        return results;
    } catch (err) {
        return [{ url: sitemapUrl, issues: [`Error: ${err.message}`] }];
    }
}

module.exports = {
    crawlSinglePage,
    crawlMultiplePages,
    crawlSitemap
};