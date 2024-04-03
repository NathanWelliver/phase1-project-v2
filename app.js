document.addEventListener('DOMContentLoaded', () => {
    /// / QUERY SELECTORS ////
    // Music Player
    const musicPlayer = document.querySelector('.music__player');
    const playBtn =  document.querySelector('#play');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    const audio = document.querySelector('#audio');

    // Title and Image
    const audioTitle = document.querySelector('.music__title');
    const audioImage = document.querySelector('.music__img');
    
    // Songs
    let songs;
    let songIndex = 0;

    // Add Songs Feature
    const newSongContainer = document.querySelector('.music__form--container')
    const newSongBtn = document.querySelector('#new__music--button');
    let addSong = false;
    // music list
    const musicList = document.querySelector('#music_list')
    /// / FUNCTIONS ////

    function loadSong(song) {
        audioTitle.innerText = song.title;
        audio.src = `${song.audio}`;
        audioImage.style.backgroundImage = `url('${song.cover}')`;
    }

    // display songs in a list
    function loadSongList(song) {
        const list = document.createElement('ul')
        list.id = song.id
        list.innerHTML = `
            <h4>${song.title}</h4>
            <audio src="${song.audio}"></audio>
            <h5>${song.author}</h5>
            <br>
        `;
        musicList.appendChild(list);
        console.log()
    }

    // check if song is playing
    function isAudioPlaying() {
        return musicPlayer.classList.contains('playing');
    }

    // play audio of current song
    function playAudio() {
        musicPlayer.classList.add('playing');
        playBtn.querySelector('i').classList.remove('ph-play-circle');
        playBtn.querySelector('i').classList.add('ph-pause-circle');
        audio.play();
    }

    // pause audio of current song
    function pauseAudio() {
        musicPlayer.classList.remove('playing');
        playBtn.querySelector('i').classList.add('ph-play-circle');
        playBtn.querySelector('i').classList.remove('ph-pause-circle');
        audio.pause();
    }
    
    // Load songs from "server"
    function retrieveSongsFromServer() {
        fetch('http://localhost:3000/songs')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                songs = data;

                loadSong(songs[songIndex])

                songs.forEach(song => {
                    loadSongList(song)
                });
                
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
    retrieveSongsFromServer();

    // load up previous song
    function prevSong() {
        songIndex -= 1;
        if (songIndex < 0) {
            songIndex =  songs.length - 1;
        }
        loadSong(songs[songIndex]);
        isAudioPlaying() === true ? playAudio() : pauseAudio();
    }

    // load up next song
    function nextSong() {
        songIndex += 1;
        if (songIndex > songs.length - 1){
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        isAudioPlaying() === true ? playAudio() : pauseAudio();
    }

    // Input form for new songs
    const addMusicForm = document.querySelector('.add__music--form');

    addMusicForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Extracting data from the form
        const title = addMusicForm.querySelector('[name="new__music--title"]').value;
        const audioLink = addMusicForm.querySelector('[name="new__music--audio--link"]').value;
        const author = addMusicForm.querySelector('[name="new__music--author"]').value;

        // Creating the song object
        const newSong = {
            title,
            audio: audioLink,
            author: author,
        };
            
        fetch('http://localhost:3000/songs', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                'Accept': 'applicaton/json'
            },
            body: JSON.stringify(newSong)
        })
        .then(res => res.json())
        .then(data => {
            loadSong(data);
            addMusicForm.reset();
        })
    });


    /// / EVENT LISTENERS ////
    
    // Play, prev, next btns
    playBtn.addEventListener('click', () => {
        isAudioPlaying() ? pauseAudio() : playAudio();
    });
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    // Expand new song form button
    newSongBtn.addEventListener('click', () => {
        addSong = !addSong;
        if (addSong) {
            newSongContainer.style.display = "block";
        } else {
            newSongContainer.style.display = "none";
        }
    });



});    