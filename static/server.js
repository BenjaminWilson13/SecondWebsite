const http = require('http');
const fs = require('fs');
const fetch = require("node-fetch");
let APIreply = {};
// import { getTheCat } from './pictureGeneration';

const signed = [];
let visitors = 1;

const server = http.createServer((request, response) => {
    // console.log(request.headers) //BEEEEG CHUNK
    let requestBody = '';
    request.on('data', (data) => {
        requestBody += data;
    });
    request.on('end', () => {
        if (requestBody) {
            console.log(request.headers['content-type']);
            if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {

                request.body = requestBody
                    .split("&")
                    .map((keyValuePair) => keyValuePair.split("="))
                    .map(([key, value]) => [key, value.replace(/\+/g, " ")])
                    .map(([key, value]) => [key, decodeURIComponent(value)])
                    .reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});
            }
            else if (request.headers['content-type'] === 'application/json') {
                request.body = JSON.parse(requestBody);
            }
        }

        if (request.method === 'GET') {
            if (request.url === '/' || request.url === '/index.html') {
                currentDate = new Date();
                console.log(`${currentDate} - Index page visit.`)
                const htmlReturn = fs.readFileSync('./index.html', 'utf-8');
                response.statusCode = 418;
                response.setHeader('Content-Type', 'text/html');
                response.write(htmlReturn);
                return response.end();
            }

            if (request.url === '/styles.css') {
                const cssReturn = fs.readFileSync('./styles.css', 'utf-8');
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/css');
                response.write(cssReturn);
                return response.end();
            }

            if (request.url === '/page2.html') {
                currentDate = new Date();
                console.log(`${currentDate} - Page2 visit.`)
                let htmlReturn = fs.readFileSync('./page2.html', 'utf-8');
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');

                let guestList = '';
                let firstname = '';
                let lastname = '';
                let text = '';
                for (let element of signed) {
                    firstname = element.first_name;
                    lastname = element.last_name;
                    text = element.description;
                    while (true) {
                        firstname = firstname.replace('<', '');
                        lastname = lastname.replace('<', '');
                        text = text.replace('<', '');
                        firstname = firstname.replace('>', '');
                        lastname = lastname.replace('>', '');
                        text = text.replace('>', '');

                        if (firstname.indexOf('<') === -1 && lastname.indexOf('<') === -1 && text.indexOf('<') === -1) {
                            break;
                        }
                    }
                    guestList += `<li>First Name: ${firstname}     Last Name: ${lastname} <ul> <li>Some Text: ${text}</li></ul></li>`
                }
                htmlReturn = htmlReturn.replace('#{signee}', guestList);
                response.write(htmlReturn);
                return response.end();
            }

            if (request.url === '/page3.html') {
                currentDate = new Date();
                console.log(`${currentDate} - Page3 visit.`)
                const htmlReturn = fs.readFileSync('./page3.html', 'utf-8');
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.write(htmlReturn);
                return response.end();
            }

            if (request.url === '/page4.html') {
                currentDate = new Date();
                console.log(`${currentDate} - Page4 visit.`)
                const htmlReturn = fs.readFileSync('./page4.html', 'utf-8');
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.write(htmlReturn);
                return response.end();
            }

            if (request.url === '/images' || request.url === '/images.html') {
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/html');
                htmlReturn = fs.readFileSync('./index.html', 'utf-8');
                response.write(htmlReturn);
                return response.end();
            }

            const urlSplit = request.url.split('/');
            urlSplit.splice(0, 1);

            if (urlSplit[0] === 'images') {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'image/jpg')
                interpoBoi = urlSplit.join('/')
                const imageReturn = fs.readFileSync(`./${interpoBoi}`);
                response.write(imageReturn);
                return response.end();
            }

            if (request.url === '/weather.html') {
                currentDate = new Date();
                console.log(`${currentDate} - WeatherPage visit.`)
                let htmlReturn = fs.readFileSync('./weather.html', 'utf-8');
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                htmlReturn = htmlReturn.replace('${location}', `City`)
                htmlReturn = htmlReturn.replace('${temp}', `Temperature in Fahrenheit`)
                htmlReturn = htmlReturn.replace('${condition}', `Local Weather Condition`)
                htmlReturn = htmlReturn.replace('${wind_speed}', `Wind Speed`)
                htmlReturn = htmlReturn.replace('${wind_dir}', `Wind Direction`)
                htmlReturn = htmlReturn.replace('${humidity}', `Humidity`)
                htmlReturn = htmlReturn.replace('${temp_feelsLike}', `Feels like in Fahreheit`)
                response.write(htmlReturn);
                return response.end();
            }

            if (request.method === 'GET' && request.url === '/favicon.ico') {
                let iconReturn = fs.readFileSync('./icon.png');
                response.statusCode = 200;
                response.setHeader('Content-Type', 'image/png');
                response.write(iconReturn);
                return response.end();
            }

            console.log(request.url); 

            if (request.method === 'GET' && request.url === '/scripts.js') {
                let scriptReturn = fs.readFileSync('./scripts.js', 'utf-8'); 
                response.statusCode = 200; 
                response.setHeader('Content-Type', 'text/javascript'); 
                response.write(scriptReturn); 
                return response.end(); 
            }

            if (request.method === 'GET' && request.url === '/catPics.html') {
                let htmlReturn = fs.readFileSync('./catPics.html', 'utf-8'); 
                response.statusCode = 200; 
                response.setHeader('Content-Type', 'text/html'); 
                response.write(htmlReturn); 
                return response.end(); 
            }

            if (request.method === 'GET' && request.url === '/catpic.png') {
                response.statusCode = 200; 
                response.setHeader('Content-Type', 'image/png'); 
                response.write(getTheCat()); 
            }
        }

        if (request.method === 'POST') {
            if (request.url === '/signBook') {
                currentDate = new Date();
                console.log(`${currentDate} - Signed Book`)
                if (request.body.first_name === undefined) {
                    request.body.first_name = 'not provided';
                }
                if (request.body.last_name === undefined) {
                    request.body.last_name = 'not provided';
                }
                if (request.body.description === undefined) {
                    request.body.description = 'not provided';
                }
                signed.push(request.body);
                response.statusCode = 302;
                response.setHeader('Location', '/page2.html');
                return response.end();
            }

            if (request.url === '/enter-location') {
                console.log(request.body)
                console.log(request.body.api_location);
                if (request.body.api_location === '') {
                    request.body.api_location = 'Nashville';
                }
                response.setHeader('Content-Type', 'text/html')
                response.statusCode = 200;
                let htmlReturn = fs.readFileSync('./weather.html', 'utf-8');
                fetch(`http://api.weatherapi.com/v1/current.json?key=90f77ed6439c46f283480240232003&q=${request.body.api_location}&aqi=yes`)
                    .then(res => {
                        res.text().then(res => {
                            APIreply = JSON.parse(res)
                            if (APIreply.error === undefined) {

                                htmlReturn = htmlReturn.replace('${location}', `${APIreply.location.name}`)
                                htmlReturn = htmlReturn.replace('${temp}', `${APIreply.current.temp_f} Degrees F`)
                                htmlReturn = htmlReturn.replace('${condition}', `${APIreply.current.condition.text}`)
                                htmlReturn = htmlReturn.replace('${wind_speed}', `${APIreply.current.wind_mph} MPH`)
                                htmlReturn = htmlReturn.replace('${wind_dir}', `${APIreply.current.wind_dir}`)
                                htmlReturn = htmlReturn.replace('${humidity}', `${APIreply.current.humidity}%`)
                                htmlReturn = htmlReturn.replace('${temp_feelsLike}', `${APIreply.current.feelslike_f} Degrees F`)
                                response.write(htmlReturn);
                                APIreply = {};
                            }
                            else {
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'text/html');
                                return response.end(fs.readFileSync('./index.html', 'utf-8'));
                            }
                            return response.end();
                        })
                    });
                return;
            }
        }

        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        response.end(fs.readFileSync('./index.html', 'utf-8'));
    });
});


const port = 5000;

server.listen(port, () => console.log(`Server is listening on port ${port}...`))