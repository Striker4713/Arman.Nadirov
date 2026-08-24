// Serverless-функция для Vercel. Подменяет заголовки, чтобы Cloudflare думал, что мы обычный браузер.
export default async function handler(req, res) {
    const path = req.query.path;
    if (!path) {
        return res.status(400).json({error: 'Не указан путь к API'});
    }

    const fplUrl = `https://fantasy.premierleague.com/api/${path}`;

    try {
        // Делаем запрос к FPL, надевая "маску" обычного браузера Google Chrome
        const fetchRes = await fetch(fplUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://fantasy.premierleague.com',
                'Referer': 'https://fantasy.premierleague.com/'
            }
        });

        if (!fetchRes.ok) {
            return res.status(fetchRes.status).json({error: `FPL Server returned ${fetchRes.status}`});
        }

        const data = await fetchRes.json();
        // Разрешаем нашему сайту читать эти данные
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
