(function () {
    var STORAGE_KEY = "journeyMusic";
    var journeyTrack = "songs/journey-placeholder.mp3";
    var messageTrack = "songs/message3-placeholder.mp3";
    var pageName = window.location.pathname.split("/").pop() || "index.html";
    var backgroundAudio;

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

    function playTrack(track, resume) {
        var savedState = readState();
        backgroundAudio = new Audio(track);
        backgroundAudio.loop = true;
        backgroundAudio.preload = "auto";

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

    var state = readState();
    if (state && state.track === journeyTrack) {
        playTrack(journeyTrack, true);
    }
}());
