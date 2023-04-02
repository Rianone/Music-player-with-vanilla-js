
const options = {
    method: 'GET',
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
const durationContainer = document.getElementById('duration');
const seekSlider = document.getElementById('seek-slider');

var bgindex = 0;


const currentTimeContainer = document.getElementById('current-time');

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

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
    if (bgindex == 15) {
        bgindex = 0;
    }
    body.style.background = "url(./images/bg" + bgindex + ".png) no-repeat";
    body.style.backgroundSize = "cover"
}

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio_component.duration);
}


fetch('./data.json', options)
    .then(response => response.json())
    .then(response => {

        let index = 0;
        let start_music = response[index];
        let playing = true;
       
        getArtistName(start_music)

        control_pause.addEventListener('click', () => {
            control_pause.classList.toggle("fa-pause-circle");
            control_pause.classList.toggle("fa-play-circle");
            
            audio_component.src = start_music.trackMetadata.trackUri;
            
            if (playing) {
                audio_component.play();
                sound_wave.classList.toggle("display")
            }
            else {
                audio_component.pause();
                sound_wave.classList.toggle("display")
            }
            playing = !playing;
        })

        if (audio_component.readyState > 0) {
            displayDuration();
            const bufferedAmount = audio_component.buffered.end(audio_component.buffered.length - 1);
            const seekableAmount = audio_component.seekable.end(audio_component.seekable.length - 1);
        } else {
            audio_component.addEventListener('loadedmetadata', () => {
                displayDuration();
            });
        }

        seekSlider.addEventListener('change', () => {
            audio_component.currentTime = seekSlider.value;
        });

        audio_component.addEventListener('timeupdate', () => {
            seekSlider.value = Math.floor(audio_component.currentTime);
        });

        control_next.addEventListener("click", () => {
            index++;
            start_music = response[index]
            getArtistName(start_music)

            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.play()
            control_pause.classList.add("fa-pause-circle");
            control_pause.classList.remove("fa-play-circle");

            bgindex++;
            setBg()
        })

        control_previous.addEventListener("click", () => {
            index--;
            start_music = response[index]
            getArtistName(start_music)

            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.play()
            control_pause.classList.add("fa-pause-circle");
            control_pause.classList.remove("fa-play-circle");

            bgindex--;
            setBg()
        })
}).catch(err => console.error(err));