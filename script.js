
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
const songW = document.getElementById("songW");
const song_writers = document.getElementById("song-writers");
const release_date = document.getElementById("release-date");
const title_music = document.getElementById("music-title");

const modal_playlist = document.querySelector(".modal-playlist");
const song_container = document.querySelector(".song-container");
const show_playlist = document.getElementById('show_playlist');


var bgindex = 0;
let volume = true;
let rAF = null;
var playlist_set = false
var start_music;
var playing = true;
var playing_time = 0

const whilePlaying = () => {
    playing_time = audio_component.currentTime;
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
    body.style.background = "url(./images/bg" + bgindex + ".avif) no-repeat";
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

function set_playlist(response) {
    for (let i = 0; i < response.length; i++) {
        
        const info = response[i];

        var element = document.createElement("div");
        element.className = "song";
        element.title = "Choose song";

        var img = document.createElement("img");
        img.alt = "song image";
        img.src = info.trackMetadata.displayImageUri;
        element.appendChild(img);

        var details = document.createElement("div");
        details.className = "details";

        var song_name = document.createElement("p");
        song_name.className = "song-name";
        song_name.innerHTML = info.trackMetadata.trackName;
        var artist = document.createElement("span");
        artist.className = "artist";
        for (let j = 0; j < info.trackMetadata.artists.length; j++) {
            var elm = document.createElement('span');
            elm.innerHTML = (j+1 == info.trackMetadata.artists.length) ? info.trackMetadata.artists[j].name : info.trackMetadata.artists[j].name + " , ";
            artist.appendChild(elm);
        }

        if (start_music == info.chartEntryData.currentRank - 1) {
            element.classList.add("current-song");
        }

        details.appendChild(song_name);
        details.appendChild(artist);
        element.appendChild(details);

        var rank = document.createElement("span");
        rank.className = "rank";
        rank.innerHTML = info.chartEntryData.currentRank;
        element.appendChild(rank);

        element.addEventListener("click", () => {
            start_music = response[info.chartEntryData.currentRank - 1];
            getArtistName(start_music);

            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.play()
            control_pause.classList.remove("fa-play-circle");
            control_pause.classList.add("fa-pause-circle");
            sound_wave.classList.add("display");
            requestAnimationFrame(whilePlaying);
            
            bgindex = info.chartEntryData.currentRank - 1 ;
            setBg()
            
            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
            
            modal_playlist.style.display = "none";
            playing = !playing;
        })

        song_container.appendChild(element);
    }
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio_component.duration);
}


volume_btn.addEventListener("click", () => {
    if (volume) {
        audio_component.volume = 0;
        volume_btn.classList.remove("fa-volume-up");
        volume_btn.classList.add("fa-volume-off");
        volume_btn.title = "Sound on";
    }
    else {
        volume_btn.title = "Mute";
        audio_component.volume = 1;
        volume_btn.classList.remove("fa-volume-off");
        volume_btn.classList.add("fa-volume-up");
    }
    volume = !volume;
})


fetch('./data.json', options)
    .then(response => response.json())
    .then(response => {

        let index = 0;
        start_music = response[index];
       

        show_playlist.addEventListener('click', () => {
            modal_playlist.style.display = "flex";

            if (!playlist_set) {
                set_playlist(response);
                playlist_set = true
            }
        })
       
        music_image.addEventListener("click", () => {
            modal_info.style.display = "flex";

            title_music.innerHTML = start_music.trackMetadata.trackName;
            track_name.innerHTML = start_music.trackMetadata.trackName;
            current_rank.innerHTML = start_music.chartEntryData.currentRank;

            for (let j = 0; j < start_music.trackMetadata.artists.length; j++) {
                artists.innerHTML = "";
                var element = document.createElement('li');
                element.innerHTML = start_music.trackMetadata.artists[j].name;
                artists.appendChild(element);
            }

            if (start_music.trackMetadata.producers.length == 0) {
                producers.innerHTML = "None"
            }
            else {
                producers.innerHTML = "";
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
                labels.innerHTML = "";
                for (let j = 0; j < start_music.trackMetadata.labels.length; j++) {
                    var element = document.createElement('li');
                    element.innerHTML = start_music.trackMetadata.labels[j].name;
                    labels.appendChild(element);
                }
            }

            if (start_music.trackMetadata.songWriters.length == 0) {
                songW.innerHTML = "None"
            }
            else {
                songW.innerHTML = "";
                for (let j = 0; j < start_music.trackMetadata.songWriters.length; j++) {
                    var element = document.createElement('li');
                    element.innerHTML = start_music.trackMetadata.songWriters[j].name;
                    song_writers.appendChild(element);
                }
            }

            release_date.innerHTML = start_music.trackMetadata.releaseDate;

        });

        window.addEventListener("click", function (evt) {
            if (evt.target == modal_info) {
                modal_info.style.display = "none";
            }

            if (evt.target == modal_playlist) {
                modal_playlist.style.display = "none";
            }
        });


        getArtistName(start_music)

        control_pause.addEventListener('click', () => {
           
                audio_component.src = start_music.trackMetadata.trackUri;
                
                if (playing) {
                    control_pause.classList.remove("fa-play-circle");
                    control_pause.classList.add("fa-pause-circle");
                    audio_component.play();
                    audio_component.currentTime =playing_time;
                    sound_wave.classList.add("display")
                    requestAnimationFrame(whilePlaying);
                }
                else {
                    control_pause.classList.add("fa-play-circle");
                    control_pause.classList.remove("fa-pause-circle");
                    audio_component.pause();
                    audio_component.currentTime = playing_time;
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
            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
        });

        audio_component.addEventListener("ended", () => {
            if (index == 15) {
                index = 0
            }
            index++;
            start_music = response[index]
            getArtistName(start_music)

            audio_component.src = start_music.trackMetadata.trackUri;
            audio_component.play()
            playing = true;

            if (playing) {
                control_pause.classList.remove("fa-play-circle");
                control_pause.classList.add("fa-pause-circle");
                audio_component.play();
                sound_wave.classList.add("display")
                requestAnimationFrame(whilePlaying);
            }
            else {
                control_pause.classList.add("fa-play-circle");
                control_pause.classList.remove("fa-pause-circle");
                audio_component.pause();
                sound_wave.classList.remove("display")
                cancelAnimationFrame(rAF);
            }
            playing = !playing;

            sound_wave.classList.add("display")

            bgindex++;
            setBg()

            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
        })

        
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
            
            if (playing) {
                control_pause.classList.remove("fa-play-circle");
                control_pause.classList.add("fa-pause-circle");
                audio_component.play();
                sound_wave.classList.add("display")
                requestAnimationFrame(whilePlaying);
            }
            else {
                control_pause.classList.add("fa-play-circle");
                control_pause.classList.remove("fa-pause-circle");
                audio_component.pause();
                sound_wave.classList.remove("display")
                cancelAnimationFrame(rAF);
            }
            playing = !playing;
            
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

            if (bgindex == 0) {
                bgindex = 15;
            }
            bgindex--;
            setBg()

            audio_component.addEventListener('timeupdate', () => {
                seekSlider.value = Math.floor(audio_component.currentTime);
            });
        })
}).catch(err => console.error(err));
