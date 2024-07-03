let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

const playMusic = (track,songName,artist, pause = false)=>{
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play()
        document.getElementById("play").innerHTML = `<svg data-encore-id="icon" role="play" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 dYnaPI"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>`;
    }
    document.getElementsByClassName("song-title")[0].innerHTML = songName;
    document.getElementsByClassName("artist-names")[0].innerHTML = artist;
    document.getElementsByClassName("album-cover")[0].src = `/Images/${songName}.jpeg`;
    document.getElementsByClassName("current-time")[0].innerHTML = "0:00";
    document.getElementsByClassName("total-time")[0].innerHTML = "0:00";
}

async function main(){
    songs = await getSongs();
    let songDiv = document.querySelector(".spotify-playlist");
    let OldartistOld = songs[0].replaceAll("%20"," ").replaceAll("%2C",",").split("-")[1];
    let Defaultartist = OldartistOld.split(".mp")[0];
    let DefaultsongName = songs[0].replaceAll("%20"," ").replaceAll("%2C",",").split("-")[0];
    playMusic(songs[0],DefaultsongName,Defaultartist,true);
   
    for (const song of songs) {
        let artistOld = song.replaceAll("%20"," ").replaceAll("%2C",",").split("-")[1];
        let artist = artistOld.split(".mp")[0];
        let songName = song.replaceAll("%20"," ").replaceAll("%2C",",").split("-")[0];
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML =  `<img>
                        <div class="play"><button id="play-button"><svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg></button>
                        </div>
                        <div class="info">
                        <h4>${songName}</h4>
                        <p>${artist}</p>
                        </div>`;
        card.getElementsByTagName("img")[0].src = `/Images/${songName}.jpeg`;
        songDiv.appendChild(card);
    }
    
    Array.from(document.querySelector(".spotify-playlist").getElementsByClassName("card")).forEach(e=>{
        let btn = e.getElementsByTagName("button")[0];
        btn.addEventListener("click",()=>{
            playMusic((e.querySelector(".info").firstElementChild.innerHTML+"-"+e.querySelector(".info").getElementsByTagName("p")[0].innerHTML+".mp3"),(e.querySelector(".info").firstElementChild.innerHTML),(e.querySelector(".info").getElementsByTagName("p")[0].innerHTML));
        }) 
    })

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            document.getElementById("play").innerHTML = `<svg data-encore-id="icon" role="play" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 dYnaPI"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>`;
        }
        else{
            currentSong.pause();
            document.getElementById("play").innerHTML = `<svg data-encore-id="pause" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 dYnaPI"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>`;
        }
    })
    let isRepeat = false;
    let repeat = document.getElementById("repeat");
    repeat.addEventListener("click",()=>{
        isRepeat = !isRepeat;
        repeat.classList.toggle("active", isRepeat);
        document.getElementById("repeat").getElementsByTagName("svg")[0].style.fill = isRepeat ? "#1db954":"#b3b3b3";
    })

    let isShuffle = false;
    let shuffle = document.getElementById("shuffle");
    shuffle.addEventListener("click",()=>{
        isShuffle = !isShuffle;
        shuffle.classList.toggle("active", isShuffle);
        document.getElementById("shuffle").getElementsByTagName("svg")[0].style.fill = isShuffle ? "#1db954":"#b3b3b3";
    })

    currentSong.addEventListener("timeupdate", () => {
       document.getElementsByClassName("current-time")[0].innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`;
       document.getElementsByClassName("total-time")[0].innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`;
       document.getElementsByClassName("progress")[0].style.width = (currentSong.currentTime/currentSong.duration)*100+"%";
    })

    function getRandomIndex(min, max, excludedNumber) {
        let randomNum;
        do {
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (randomNum === excludedNumber);
        return randomNum;
    }

    currentSong.addEventListener("ended",()=>{
        if (isRepeat) {
            currentSong.currentTime = 0;
            currentSong.play();
        }
        else if(isShuffle){
            let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
            let nextIndex = getRandomIndex(0,songs.length,index);
            let nextTrack = songs[nextIndex];
            let artistOld = nextTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[1];
            let artist = artistOld.split(".mp")[0];
            let songName = nextTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[0];
            playMusic(nextTrack, songName, artist, false);
        }
        else{
        let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
        let nextIndex = (index + 1) % songs.length;
        let nextTrack = songs[nextIndex];
        let artistOld = nextTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[1];
        let artist = artistOld.split(".mp")[0];
        let songName = nextTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[0];
        playMusic(nextTrack, songName, artist, false);
        }
    })

    const progressBar = document.querySelector(".progress-bar");
    const progressHandle = document.querySelector(".progress");
    let isDraggingProgress = false;

    document.addEventListener("mousemove", (e) => {
        if (isDraggingProgress) {
            let rect = progressBar.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;
            let percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
            progressBar.style.setProperty('--progress-width', percent + '%');
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDraggingProgress) {
            let rect = progressBar.getBoundingClientRect();
            let offsetX = event.clientX - rect.left;
            let percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
            currentSong.currentTime = (currentSong.duration * percent) / 100;
        }
        isDraggingProgress = false;
    });

    progressBar.addEventListener("click", e => {
        let percent = (e.offsetX / progressBar.offsetWidth) * 100;
        progressBar.style.setProperty('--progress-width', percent + '%');
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    progressHandle.addEventListener("mousedown", () => {
        isDraggingProgress = true;
    });

    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
        let previousIndex = (index - 1 + songs.length) % songs.length;
        let previousTrack = songs[previousIndex];
        let artistOld = previousTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[1];
        let artist = artistOld.split(".mp")[0];
        let songName = previousTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[0];
        playMusic(previousTrack, songName, artist, currentSong.paused);
    })

    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/songs/").slice(-1)[0]);
        let nextIndex = (index + 1) % songs.length;
        let nextTrack = songs[nextIndex];
        let artistOld = nextTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[1];
        let artist = artistOld.split(".mp")[0];
        let songName = nextTrack.replaceAll("%20", " ").replaceAll("%2C",",").split("-")[0];
        playMusic(nextTrack, songName, artist, currentSong.paused);
    })

    const volumeBar = document.querySelector(".volume-bar");
    const volumeHandle = document.querySelector(".volume");
    currentSong.volume = 1;
    volumeBar.style.setProperty('--volume-width', '100%');

    let isDragging = false;

    volumeHandle.addEventListener("mousedown", () => {
        isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let rect = volumeBar.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;
            let percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
            volumeBar.style.setProperty('--volume-width', percent + '%');
            currentSong.volume = percent / 100;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    volumeBar.addEventListener("click", e => {
        let percent = (e.offsetX / volumeBar.offsetWidth) * 100;
        volumeBar.style.setProperty('--volume-width', percent + '%');
        currentSong.volume = Math.max(0, Math.min(percent / 100, 1));
        currentSong.muted = currentSong.volume === 0;
    
        if (!currentSong.muted) {
            lastVolume = currentSong.volume;
        }
    });

    const muteButton = document.querySelector('.mute');
    let lastVolume = currentSong.volume;

    muteButton.addEventListener('click', () => {
        if (currentSong.muted) {
            currentSong.muted = false;
            currentSong.volume = lastVolume;
            volumeBar.style.setProperty('--volume-width', lastVolume * 100 + '%');
            document.getElementById("volume-btn").innerHTML = `
                <svg data-encore-id="unmute" role="presentation" aria-label="Volume high" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 kcUFwU">
                    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
                    <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path>
                </svg>`;
        } else {
            lastVolume = currentSong.volume;
            currentSong.muted = true;
            currentSong.volume = 0;
            volumeBar.style.setProperty('--volume-width', '0%');
            document.getElementById("volume-btn").innerHTML = `
                <svg data-encore-id="mute" role="presentation" aria-label="Volume off" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 kcUFwU">
                    <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
                    <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
                </svg>`;
        }

    });
}
main();