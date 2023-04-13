require('express-async-errors');
const fetch = require("node-fetch");

require('dotenv').config();

const express = require('express');
const app = express();

const frameguard = require("frameguard");
app.use(frameguard({ action: "SAMEORIGIN" }));

const fs = require('fs');

const jason = {
    "prompt": "default",
    "seed": 0,
    "used_random_seed": true,
    "negative_prompt": "",
    "num_outputs": 1,
    "num_inference_steps": 25,
    "guidance_scale": 7.5,
    "width": 512,
    "height": 512,
    "vram_usage_level": "balanced",
    "use_stable_diffusion_model": "sd-v1-4",
    "use_vae_model": "",
    "stream_progress_updates": true,
    "stream_image_progress": false,
    "show_only_filtered_image": true,
    "block_nsfw": true,
    "output_format": "png",
    "output_quality": 75,
    "metadata_output_format": "txt",
    "original_prompt": "",
    "active_tags": [],
    "inactive_tags": [],
    "sampler_name": "euler_a",
    "session_id": "1679446917820"
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.url, new Date()); 
    // console.log(req.headers); 
    return next(); 
})

app.get('/aiImageAPI.html/onlineStatus', async (req, res, next) => {
    let result = await fetch(`http://192.168.1.100:9000/ping?session_id=${jason.session_id}`); 
    result = await result.json(); 
    if (result.status === 'Online') {
        return res.send('Online'); 
    } else {
        return res.send('Offline'); 
    }
})


app.get('/aiImageAPI.html', async (req, res, next) => {
    if (!req.query.prompt_box) {
        return next();
    }
    try {
        jason.prompt = req.query.prompt_box;
        jason.seed = getRandomIntInclusive(0, 4294967295);
        const body = JSON.stringify(jason)
        const headers = { "Content-Type": "application/json" };
        const options = {
            method: "POST",
            headers: headers,
            body: body
        }
        let render = await fetch("http://192.168.1.100:9000/render", options);
        render = await render.json();
        console.log('render: ', render, render.task);


        let result;
        while (true) {

            result = await fetch(`http://192.168.1.100:9000/ping?session_id=${jason.session_id}`);
            result = await result.json();
            if (result.status === 'Online') {
                break;
            }
        }

        let image = await fetch(`http://192.168.1.100:9000/image/stream/${Number.parseInt(render.task)}`)
        let data = await image.text();
        data = data.split(' ');
        let maxIndex = 0;
        let maxLength = -Infinity;
        for (let i = 0; i < data.length; i++) {
            if (data[i].length > maxLength) {
                maxIndex = i;
                maxLength = data[i].length;
            }
        }
        data = data[maxIndex].split(',')[1];
        data = data.split('"')[0];
        const img = Buffer.from(data, 'base64');

        // fs.writeFile("out.png", data, 'base64', function(err) {
        //     console.log(err);
        //   });

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });

        return res.end(img);
    } catch (e) {
        return res.send('Looks like my PC is offline, sorry about that!')
    }
})

app.use('/', express.static('static'));

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));