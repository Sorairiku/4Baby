(function () {
    var journeyTrack = "songs/journey-placeholder.mp3";
    var messageTrack = "songs/message3.mp3";
    var pageName = window.location.pathname.split("/").pop() || "index.html";
    var isMessagePage = pageName === "message3.html";
    var track = isMessagePage ? messageTrack : journeyTrack;
    var volumeStorageKey = isMessagePage ? "messageVolume" : "journeyVolume";
    var positionStorageKey = isMessagePage ? "messagePosition" : "journeyPosition";
    var playingStorageKey = isMessagePage ? "messagePlaying" : "journeyPlaying";
    var journeyStartedKey = "journeyStarted";
    var defaultVolume = isMessagePage ? 0.2 : 0.3;
    var storedVolume = localStorage.getItem(volumeStorageKey);
    var volume = storedVolume === null ? defaultVolume : Number(storedVolume);
    var backgroundAudio;

    function updateVolumeDisplay(volumeDisplay) {
        volumeDisplay.textContent = volume === 0 ? "\uD83D\uDD07" : volume < 0.5 ? "\uD83D\uDD09" : "\uD83D\uDD0A";
        volumeDisplay.setAttribute("aria-label", "Volume " + Math.round(volume * 100) + "%");
    }

    function savePlaybackPosition() {
        if (backgroundAudio && Number.isFinite(backgroundAudio.currentTime)) {
            localStorage.setItem(positionStorageKey, backgroundAudio.currentTime);
        }
    }

    function stopMusic() {
        if (!backgroundAudio) {
            return;
        }

        backgroundAudio.pause();
        savePlaybackPosition();
        localStorage.setItem(playingStorageKey, "false");
    }

    function playTrack() {
        if (!isMessagePage && (pageName === "index.html" || pageName === "story.html")) {
            localStorage.setItem(journeyStartedKey, "true");
        }

        if (!backgroundAudio) {
            backgroundAudio = new Audio(track);
            backgroundAudio.loop = true;
            backgroundAudio.preload = "auto";
            backgroundAudio.volume = volume;
            backgroundAudio.setAttribute("playsinline", "");

            var storedPosition = Number(localStorage.getItem(positionStorageKey));
            if (Number.isFinite(storedPosition) && storedPosition > 0) {
                backgroundAudio.currentTime = storedPosition;
            }

            backgroundAudio.addEventListener("timeupdate", savePlaybackPosition);
            backgroundAudio.addEventListener("play", function () {
                localStorage.setItem(playingStorageKey, "true");
            });
            backgroundAudio.addEventListener("pause", savePlaybackPosition);
        }

        backgroundAudio.play().catch(function () {
            document.addEventListener("pointerdown", function resumeAudio() {
                if (backgroundAudio) {
                    backgroundAudio.play().catch(function () {});
                }
            }, { once: true });
        });
    }

    function createMusicControls() {
        var controls = document.querySelector(".story-music-controls");
        if (!controls) {
            controls = document.createElement("details");
            controls.className = "story-music-controls";
            controls.innerHTML = '<summary class="volume-toggle" aria-label="Open music controls" title="Music controls">&#128266;</summary>' +
                '<div class="music-popover"><div class="music-popover-heading"><span>Story music</span><span class="volume-icon" aria-hidden="true">&#128266;</span></div>' +
                '<div class="music-actions"><button type="button" data-audio-action="play" aria-label="Play music" title="Play music">&#9654;</button>' +
                '<button type="button" data-audio-action="stop" aria-label="Pause music" title="Pause music">&#9632;</button></div>' +
                '<label for="journey-volume">Volume</label><input id="journey-volume" type="range" data-audio-action="volume" min="0" max="1" step="0.01" value="0.3" aria-label="Volume">' +
                '<span class="volume-status" aria-live="polite">&#128266;</span></div>';
            document.body.append(controls);
        }

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

        playButton.addEventListener("click", playTrack);
        stopButton.addEventListener("click", stopMusic);
        volumeControl.addEventListener("input", function () {
            volume = Number(volumeControl.value);
            localStorage.setItem(volumeStorageKey, volume);
            if (backgroundAudio) {
                backgroundAudio.volume = volume;
            }
            updateVolumeDisplay(volumeDisplay);
        });

        var isIndexPage = pageName === "index.html";
        var isStoryPage = pageName === "story.html";
        var shouldResumeJourney = localStorage.getItem(journeyStartedKey) === "true" && localStorage.getItem(playingStorageKey) !== "false";
        if (isMessagePage || isIndexPage || isStoryPage || shouldResumeJourney) {
            playTrack();
        }
    }

    window.addEventListener("pagehide", savePlaybackPosition);
    createMusicControls();
}());
