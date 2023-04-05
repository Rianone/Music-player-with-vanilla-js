
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
const currentTimeContainer = document.getElementById('current-time');
const volume_btn = document.getElementById('volume_btn');

var bgindex = 0;
let volume = true;
let rAF = null;

const whilePlaying = () => {
    seekSlider.value = Math.floor(audio_component.currentTime);
    currentTimeContainer.innerHTML = calculateTime(seekSlider.value);
    // audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    rAF = requestAnimationFrame(whilePlaying);
}


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

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio_component.duration);
}


volume_btn.addEventListener("click", () => {
    if (volume) {
        audio_component.volume = 0;
        volume_btn.classList.remove("fa-volume-down");
        volume_btn.classList.add("fa-volume-off");
    }
    else {
        audio_component.volume = 1;
        volume_btn.classList.remove("fa-volume-off");
        volume_btn.classList.add("fa-volume-down");
    }
    volume = !volume;
})



fetch('./data.json', options)
    .then(response => response.json())
    .then(response => {

        let index = 0;
        let start_music = response[index];
        let playing = true;
        // const bufferedAmount = audio_component.buffered.end(audio_component.buffered.length - 1);
        // const seekableAmount = audio_component.seekable.end(audio_component.seekable.length - 1);
       
        getArtistName(start_music)

        control_pause.addEventListener('click', () => {
            control_pause.classList.toggle("fa-pause-circle");
            control_pause.classList.toggle("fa-play-circle");
            
            
            audio_component.src = start_music.trackMetadata.trackUri;
            
            if (playing) {
                audio_component.play();
                sound_wave.classList.add("display")
                requestAnimationFrame(whilePlaying);
            }
            else {
                audio_component.pause();
                sound_wave.classList.remove("display")
                cancelAnimationFrame(rAF);
            }
            playing = !playing;
        })

        if (audio_component.readyState > 0) {
            displayDuration();
            setSliderMax();
        } else {
            audio_component.addEventListener('loadedmetadata', () => {
                displayDuration();
                setSliderMax();
            });
        }

        audio_component.addEventListener('timeupdate', () => {
            seekSlider.value = Math.floor(audio_component.currentTime);
        });

        seekSlider.addEventListener('input', () => {
            currentTimeContainer.innerHTML = calculateTime(seekSlider.value);
            if (!audio_component.paused) {
                cancelAnimationFrame(rAF);
            }
        });

        seekSlider.addEventListener('change', () => {
            audio_component.currentTime = seekSlider.value;
            if (!audio_component.paused) {
                requestAnimationFrame(whilePlaying);
            }
        });

        control_next.addEventListener("click", () => {
            if (index == 15) {
                index = 0
            }
            index++;
            start_music = response[index]
            getArtistName(start_music)

            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.play()
            control_pause.classList.add("fa-pause-circle");
            control_pause.classList.remove("fa-play-circle");
            sound_wave.classList.add("display")

            bgindex++;
            setBg()
            playing = true;

            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
        })

        control_previous.addEventListener("click", () => {
            if (index == 0) {
                index = 15;
            }
            index--;
            start_music = response[index]
            getArtistName(start_music)

            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.play()
            control_pause.classList.add("fa-pause-circle");
            control_pause.classList.remove("fa-play-circle");
            sound_wave.classList.add("display")

            bgindex--;
            setBg()
            playing = true;

            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
        })
}).catch(err => console.error(err));
