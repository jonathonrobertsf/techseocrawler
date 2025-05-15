const axios = require('axios');
const cheerio = require('cheerio');

async function detectSchema(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let schemas = [];
        $('script[type="application/ld+json"]').each((i, el) => {
            try {
                const json = JSON.parse($(el).html());
                schemas.push(json);
            } catch (e) {
                console.error("Invalid JSON-LD block", e.message);
            }
        });
        return schemas;
    } catch (error) {
        console.error("Schema detection failed:", error.message);
        return [];
    }
}

function generateSchema(type, data) {
    if (type === 'Organization') {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": data.name || "",
            "url": data.url || "",
            "logo": data.logo || "",
            "sameAs": data.sameAs || []
        };
    }
    return { error: "Unsupported schema type" };
}

module.exports = {
    detectSchema,
    generateSchema
};