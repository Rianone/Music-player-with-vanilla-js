const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'aed82b4847mshe79a3180d79c550p14cca7jsnbe3898101093',
        'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
    }
};

const audio_component = document.getElementById('audio-track');
const control_previous = document.getElementById('control-previous');
const control_pause = document.getElementById('control-pause');
const control_next = document.getElementById('control-next');
const music_title = document.querySelector(".title");
const music_subtitle = document.querySelector(".sub-title");

fetch('https://spotify81.p.rapidapi.com/top_200_tracks', options)
    .then(response => response.json())
    .then(response => {
        console.log(response);

        let start_music = response[0];
        let artists= null;

        music_title.innerHTML = start_music.trackMetadata.trackName;

        for (let i = 0; i < start_music.trackMetadata.artists.length; i++) {
            const element = start_music.trackMetadata.artists[i];
            artists = i > 0 ? artists + " , " + element.name: element.name;
        }
        music_subtitle.innerHTML = artists;
})
    .catch(err => console.error(err));