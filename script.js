
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
const modal_info = document.querySelector('.modal-album-info');
const track_name = document.getElementById("track-name");
const current_rank = document.getElementById("current-rank");
const artists = document.getElementById("artists");
const producers = document.getElementById("producers");
const labels = document.getElementById("labels");
const song_writers = document.getElementById("song-writers");
const release_date = document.getElementById("release-date");
const title_music = document.getElementById("music-title");

var bgindex = 0;
let volume = true;
let rAF = null;




const whilePlaying = () => {
    seekSlider.value = Math.floor(audio_component.currentTime);
    currentTimeContainer.innerHTML = calculateTime(seekSlider.value);
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
       
        music_image.addEventListener("click", () => {
            modal_info.style.display = "flex";

            title_music.innerHTML = start_music.trackMetadata.trackName;
            track_name.innerHTML = start_music.trackMetadata.trackName;
            current_rank.innerHTML = start_music.chartEntryData.currentRank;

            for (let j = 0; j < start_music.trackMetadata.artists.length; j++) {
                var element = document.createElement('li');
                element.innerHTML = start_music.trackMetadata.artists[j].name;
                artists.appendChild(element);
            }

            if (start_music.trackMetadata.producers.length == 0) {
                producers.innerHTML = "None"
            }
            else {
                for (let j = 0; j < start_music.trackMetadata.producers.length; j++) {
                        var element = document.createElement('li');
                        element.innerHTML = start_music.trackMetadata.producers[j].name;
                        producers.appendChild(element);
                }
            }

            if (start_music.trackMetadata.labels.length == 0) {
                labels.innerHTML = "None"
            }
            else {
                for (let j = 0; j < start_music.trackMetadata.labels.length; j++) {
                    var element = document.createElement('li');
                    element.innerHTML = start_music.trackMetadata.labels[j].name;
                    labels.appendChild(element);
                }
            }

            if (start_music.trackMetadata.songWriters.length == 0) {
                song_writers.innerHTML = "None"
            }
            else {
                for (let j = 0; j < start_music.trackMetadata.songWriters.length; j++) {
                    var element = document.createElement('li');
                    element.innerHTML = start_music.trackMetadata.songWriters[j].name;
                    song_writers.appendChild(element);
                }
            }

            release_date.innerHTML = start_music.trackMetadata.releaseDate;

        });


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
            playing = true;
            control_pause.classList.add("fa-pause-circle");
            control_pause.classList.remove("fa-play-circle");
            sound_wave.classList.add("display")

            bgindex++;
            setBg()

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
            playing = true;
            control_pause.classList.add("fa-pause-circle");
            control_pause.classList.remove("fa-play-circle");
            sound_wave.classList.add("display")

            bgindex--;
            setBg()

            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
        })
}).catch(err => console.error(err));
