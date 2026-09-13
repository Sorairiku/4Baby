(function () {
    var STORAGE_KEY = "journeyMusic";
    var journeyTrack = "songs/journey-placeholder.mp3";
    var messageTrack = "songs/message3-placeholder.mp3";
    var pageName = window.location.pathname.split("/").pop() || "index.html";
    var backgroundAudio;
    var volume = Number(localStorage.getItem("journeyVolume")) || 1;

    function saveState(track, currentTime) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            track: track,
            currentTime: currentTime
        }));
    }

    function readState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
        } catch (error) {
            return null;
        }
    }

    function stopJourneyMusic() {
        if (backgroundAudio) {
            backgroundAudio.pause();
            backgroundAudio.removeAttribute("src");
            backgroundAudio.load();
            backgroundAudio = null;
        }
        localStorage.removeItem(STORAGE_KEY);
    }

    function updateVolumeDisplay(volumeDisplay) {
        volumeDisplay.textContent = volume === 0 ? "\uD83D\uDD07" : volume < 0.5 ? "\uD83D\uDD09" : "\uD83D\uDD0A";
        volumeDisplay.setAttribute("aria-label", "Volume " + Math.round(volume * 100) + "%");
    }

    function playTrack(track, resume) {
        var savedState = readState();
        stopJourneyMusic();
        backgroundAudio = new Audio(track);
        backgroundAudio.loop = true;
        backgroundAudio.preload = "auto";
        backgroundAudio.volume = volume;
        backgroundAudio.autoplay = true;

        if (resume && savedState && savedState.track === track) {
            backgroundAudio.currentTime = Number(savedState.currentTime) || 0;
        }

        backgroundAudio.addEventListener("timeupdate", function () {
            saveState(track, backgroundAudio.currentTime);
        });
        backgroundAudio.addEventListener("error", function () {
            saveState(track, backgroundAudio.currentTime || 0);
        });
        saveState(track, backgroundAudio.currentTime || 0);
        backgroundAudio.play().catch(function () {});
    }

    function createStoryControls() {
        var controls = document.querySelector(".story-music-controls");
        var playButton = controls.querySelector("[data-audio-action='play']");
        var stopButton = controls.querySelector("[data-audio-action='stop']");
        var volumeControl = controls.querySelector("[data-audio-action='volume']");
        var volumeDisplay = controls.querySelector(".volume-bars");

        volumeControl.value = volume;
        updateVolumeDisplay(volumeDisplay);

        document.addEventListener("click", function (event) {
            if (!controls.contains(event.target)) {
                controls.removeAttribute("open");
            }
        });

        playButton.addEventListener("click", function () {
            playTrack(journeyTrack, true);
        });
        stopButton.addEventListener("click", stopJourneyMusic);
        volumeControl.addEventListener("input", function () {
            volume = Number(volumeControl.value);
            localStorage.setItem("journeyVolume", volume);
            if (backgroundAudio) {
                backgroundAudio.volume = volume;
            }
            updateVolumeDisplay(volumeDisplay);
        });

        playTrack(journeyTrack, true);
    }

    function startJourney(event) {
        event.preventDefault();
        saveState(journeyTrack, 0);
        playTrack(journeyTrack, false);
        window.location.href = event.currentTarget.href;
    }

    if (pageName === "index.html") {
        var startButton = document.querySelector(".welcome-button");
        if (startButton) {
            startButton.addEventListener("click", startJourney);
        }
        return;
    }

    if (pageName === "songs.html") {
        stopJourneyMusic();
        return;
    }

    if (pageName === "message3.html") {
        stopJourneyMusic();
        playTrack(messageTrack, false);
        return;
    }

    if (pageName === "story.html") {
        createStoryControls();
    }
}());
