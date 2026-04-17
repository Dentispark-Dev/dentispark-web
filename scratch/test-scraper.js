const axios = require('axios');

async function testScrape(url) {
    console.log(`Testing URL: ${url}`);
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/',
                'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });
        console.log(`Success! Status: ${response.status}`);
        console.log(`Content length: ${response.data.length}`);
        return true;
    } catch (error) {
        console.error(`Failed! Error: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Headers:`, error.response.headers);
        }
        return false;
    }
}

const urls = [
    'https://www.kcl.ac.uk/study/undergraduate/courses/dentistry-bds',
    'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/dentistry-bds',
    'https://pweb.imperial.ac.uk/study/ug/courses/school-of-medicine/medicine/'
];

async function run() {
    for (const url of urls) {
        await testScrape(url);
        console.log('---');
    }
}

run();
