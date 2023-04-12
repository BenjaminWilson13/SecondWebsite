require('express-async-errors');
const fetch = require("node-fetch");

require('dotenv').config();

const express = require('express');
const app = express();

const fs = require('fs'); 

const jason = {
    "prompt": "a photograph of an astronaut riding a horse",
    "seed": 4956576,
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
    "original_prompt": "a photograph of an astronaut riding a horse",
    "active_tags": [],
    "inactive_tags": [],
    "sampler_name": "euler_a",
    "session_id": "1679446987820"
}

app.use('/', express.static('static')); 

app.get('/createImage', async (req, res) => {
    debugger
    const body = JSON.stringify(jason)
    const headers = { "Content-Type": "application/json" };
    const options = {
        method: "POST",
        headers: headers,
        body: body
    }
    let render = await fetch("http://192.168.1.100:9000/render", options);
    render = await render.json();
    console.log(render);


    let result; 
    while (true) {

        result = await fetch('http://192.168.1.100:9000/ping?session_id=1679446987820');
        result = await result.json();
        if (result.status === 'Online') {
            break; 
        } 
    }

    let image = await fetch(`http://192.168.1.100:9000/image/stream/${render.task}`)
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
    console.log(data); 
    console.log(maxLength); 
    const img = Buffer.from(data, 'base64'); 

    fs.writeFile("out.png", data, 'base64', function(err) {
        console.log(err);
      });

    res.writeHead(200, {
        'Content-Type': 'image/png', 
        'Content-Length': img.length
    }); 

    res.end(img); 
    

   

})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));