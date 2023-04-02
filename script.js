const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'aed82b4847mshe79a3180d79c550p14cca7jsnbe3898101093',
        'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
    }
}

const audio_component = document.getElementById('audio-track');
const control_previous = document.getElementById('control-previous');
const control_pause = document.getElementById('control-pause');
const control_next = document.getElementById('control-next');
const music_title = document.querySelector(".title");
const music_subtitle = document.querySelector(".sub-title");
const music_image = document.querySelector('.album-image');
const sound_wave = document.querySelector('.sound-wave');
const body = document.querySelector('body');
var bgindex = 0;


function getArtistName(start_music) {
    let artists = null;
    music_title.innerHTML = start_music.trackMetadata.trackName;
    for (let i = 0; i < start_music.trackMetadata.artists.length; i++) {
        const element = start_music.trackMetadata.artists[i];
        artists = i > 0 ? artists + " , " + element.name: element.name;
    }
    music_subtitle.innerHTML = artists;
    music_image.style.background = "url(" + start_music.trackMetadata.displayImageUri + ") no-repeat";
}

function setBg() {
    if (bgindex == 13) {
        bgindex = 0;
    }
    body.style.background = "url(./images/bg" + bgindex + ".png) no-repeat";
    body.style.backgroundSize = "cover"
}

fetch('https://spotify81.p.rapidapi.com/top_200_tracks', options)
    .then(response => response.json())
    .then(response => {
        console.log(response);

        let index = 0;
        let start_music = response[index];

        getArtistName(start_music)

        control_pause.addEventListener('click', () => {
            control_pause.classList.toggle("fa-pause-circle");
            control_pause.classList.toggle("fa-play-circle");
            
            sound_wave.classList.toggle("display")
            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.autoplay;
            
        })

        control_next.addEventListener("click", () => {
            index++;
            start_music = response[index]
            getArtistName(start_music)

            bgindex++;
            setBg()
        })

        control_previous.addEventListener("click", () => {
            index--;
            start_music = response[index]
            getArtistName(start_music)

            bgindex--;
            setBg()
        })
}).catch(err => console.error(err));