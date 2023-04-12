const fetch = require("node-fetch");
const fs = require('fs');
const request = require('request'); 


async function generateCat() {
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
    const body = JSON.stringify(jason)
    const headers = { "Content-Type": "application/json" };
    const options = {
        method: "POST",
        headers: headers,
        body: body
    }
    let res = await fetch("http://192.168.1.100:9000/render", options);
    res = await res.json();
    console.log(res);
    return res;
}

async function getTheCat(task) {
    // let result = await generateCat(); 
    let res = await fetch(`http://192.168.1.100:9000/image/stream/1491995578576`);
    console.log(res.body);
    await request(res).pipe(fs.createWriteStream('doodle.png'))

}
getTheCat(); 

// export {getTheCat}; 