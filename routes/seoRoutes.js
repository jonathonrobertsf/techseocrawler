const express = require('express');
const router = express.Router();
const { crawlSinglePage, crawlMultiplePages, crawlSitemap } = require('../services/crawler');
const { detectSchema, generateSchema } = require('../services/schemaService');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/crawl/single', async (req, res) => {
    const { url } = req.body;
    const result = await crawlSinglePage(url);
    res.render('results', { results: [result] });
});

router.post('/crawl/multiple', async (req, res) => {
    const { url, count } = req.body;
    const results = await crawlMultiplePages(url, parseInt(count));
    res.render('results', { results });
});

router.post('/crawl/sitemap', async (req, res) => {
    const { sitemap } = req.body;
    const results = await crawlSitemap(sitemap);
    res.render('results', { results });
});

router.post('/schema/detect', async (req, res) => {
    const { url } = req.body;
    const schema = await detectSchema(url);
    res.json({ schema });
});

router.post('/schema/generate', (req, res) => {
    const { type, data } = req.body;
    const schema = generateSchema(type, data);
    res.json({ schema });
});

module.exports = router;