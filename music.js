 (function () {
    var journeyTrack = "songs/journey-placeholder.mp3";
    var messageTrack = "songs/message3.mp3";
    var defaultVolume = 0.3;
    var pageName = window.location.pathname.split("/").pop() || "index.html";
    var backgroundAudio;
    var storedVolume = localStorage.getItem("journeyVolume");
    var volume = storedVolume === null ? defaultVolume : Number(storedVolume);

    function stopMusic() {
        if (backgroundAudio) {
            backgroundAudio.pause();
            backgroundAudio.removeAttribute("src");
            backgroundAudio.load();
            backgroundAudio = null;
        }
    }

    function updateVolumeDisplay(volumeDisplay) {
        volumeDisplay.textContent = volume === 0 ? "\uD83D\uDD07" : volume < 0.5 ? "\uD83D\uDD09" : "\uD83D\uDD0A";
        volumeDisplay.setAttribute("aria-label", "Volume " + Math.round(volume * 100) + "%");
    }

    function playTrack(track) {
        stopMusic();
        backgroundAudio = new Audio(track);
        backgroundAudio.loop = true;
        backgroundAudio.preload = "auto";
        backgroundAudio.volume = volume;
        backgroundAudio.autoplay = true;
        backgroundAudio.setAttribute("playsinline", "");

        backgroundAudio.play().catch(function () {
            document.addEventListener("pointerdown", function resumeAudio() {
                if (backgroundAudio) {
                    backgroundAudio.play().catch(function () {});
                }
            }, { once: true });
        });
    }

    function createMusicControls(track) {
        var controls = document.querySelector(".story-music-controls");
        var playButton = controls.querySelector("[data-audio-action='play']");
        var stopButton = controls.querySelector("[data-audio-action='stop']");
        var volumeControl = controls.querySelector("[data-audio-action='volume']");
        var volumeDisplay = controls.querySelector(".volume-status");

        volumeControl.value = volume;
        updateVolumeDisplay(volumeDisplay);

        document.addEventListener("click", function (event) {
            if (!controls.contains(event.target)) {
                controls.removeAttribute("open");
            }
        });

        playButton.addEventListener("click", function () {
            playTrack(track);
        });
        stopButton.addEventListener("click", stopMusic);
        volumeControl.addEventListener("input", function () {
            volume = Number(volumeControl.value);
            localStorage.setItem("journeyVolume", volume);
            if (backgroundAudio) {
                backgroundAudio.volume = volume;
            }
            updateVolumeDisplay(volumeDisplay);
        });

        playTrack(track);
    }

    if (pageName === "message3.html") {
        createMusicControls(messageTrack);
        return;
    }

    if (pageName === "story.html") {
        createMusicControls(journeyTrack);
    }
}());
