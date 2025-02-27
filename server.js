const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8080;
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.txt': 'text/plain',
    '.jfif': 'image/jpeg'
};

let accounts = JSON.parse(fs.readFileSync(path.join(__dirname, "accounts.json")));



const restaurantsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'restaurants.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'public', 'restaurant_template.html'), 'utf8');

fs.readdirSync(path.join(__dirname, 'public')).forEach(file => {
    if (file.startsWith('restaurant_') && file.endsWith('.html') && file !== 'restaurant_template.html') {
        fs.unlinkSync(path.join(__dirname, 'public', file));
    }
});

restaurantsData.forEach(restaurant => {
    let html = template;

    html = html.replace(/{{RESTAURANT_ID}}/g, restaurant.id);
    html = html.replace(/{{RESTAURANT_NAME}}/g, restaurant.name);
    html = html.replace(/{{ADDRESS}}/g, restaurant.address);
    html = html.replace(/{{DESCRIPTION}}/g, restaurant.description);

    fs.writeFileSync(path.join(__dirname, 'public', `restaurant_${restaurant.id}.html`), html);
    console.log(`Created restaurant_${restaurant.id}.html`);
});

const server = http.createServer((req, res) => {
    let url = req.url === '/' ? '/index.html' : req.url;
    let filePath = path.join(__dirname, "public", url);

    if(req.url === '/random_restaurant') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        let randomIndex = Math.floor(Math.random() * restaurantsData.length);
        res.end(restaurantsData[randomIndex].id.toString());
        return;
    }

    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const account = accounts.find(acc => acc.username === username && acc.password === password);
            if (account) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid username or password' }));
            }
        });
        return;
    }

    if(req.method === 'POST' && req.url === '/send-review'){
        let body ='';
        req.on('data', chunk =>{
            body+=chunk.toString();
        });
        req.on('end', () => {
            body = JSON.parse(body);
            let restaurant = restaurantsData.find(r => r.id === body[0]);
            restaurant.reviews.append({id : restaurant.reviews.length>0 ? restaurant.reviews[restaurant.reviews.length-1].id+1 : 1, user : body[1], food : body[2], service : body[3], setting : body[4], text : body[5]})

        });
        return;
    }

    if (url.startsWith('/restaurants/')) {
        const restaurantId = parseInt(url.split('/')[2]);
        const restaurant = restaurantsData.find(r => r.id === restaurantId);

        if (restaurant) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(restaurant));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Restaurant not found');
        }
        return;
    }

    const ext = path.extname(filePath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, discourse-present, discourse-logged-in, discourse-track-view');
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, "public", '404.html'), (err, data) => {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(data);
                });
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Internal server error!`);
            }
        } else {
            const headers = { 'Content-Type': mimeType };

            // Add CSP header only for JavaScript files
            if (ext === '.js') {
                headers['Content-Security-Policy'] = "script-src 'self' 'unsafe-inline'; connect-src 'self'";
            }

            res.writeHead(200, headers);
            res.end(data);
        }
    });
});

server.listen(8080, () => {
    console.log(`Server listening on port ${PORT}`);
});

process.on('exit', (code) => {
    fs.writeFileSync(path.join(__dirname, public, restaurants.json), JSON.stringify(restaurantsData))
});