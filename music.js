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

    function removeAudioResumeListeners() {
        ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
            document.removeEventListener(eventName, resumeAudioFromInteraction, true);
        });
    }

    function resumeAudioFromInteraction() {
        if (!backgroundAudio) {
            return;
        }

        var resumeAttempt = backgroundAudio.play();
        if (resumeAttempt && typeof resumeAttempt.then === "function") {
            resumeAttempt.then(removeAudioResumeListeners).catch(function () {});
            return;
        }

        removeAudioResumeListeners();
    }

    function listenForAudioInteraction() {
        ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
            document.addEventListener(eventName, resumeAudioFromInteraction, true);
        });
    }

    function playTrack() {
        if (!isMessagePage && (pageName === "index.html" || pageName === "story.html")) {
            localStorage.setItem(journeyStartedKey, "true");
        }

        var expectedTrackUrl = new URL(track, window.location.href).toString();
        if (!backgroundAudio || !backgroundAudio.src || backgroundAudio.src !== expectedTrackUrl) {
            if (backgroundAudio) {
                backgroundAudio.pause();
                backgroundAudio.src = "";
                backgroundAudio.load();
            }

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

        backgroundAudio.play().catch(listenForAudioInteraction);
    }

    window.storyMusicPause = function () {
        if (backgroundAudio) {
            backgroundAudio.pause();
        }
    };

    window.storyMusicResume = function () {
        if (localStorage.getItem(playingStorageKey) !== "false") {
            playTrack();
        }
    };

    function setActivePage(url) {
        var nextPageName = new URL(url, window.location.href).pathname.split("/").pop() || "index.html";
        var nextIsMessagePage = nextPageName === "message3.html";
        if (nextIsMessagePage === isMessagePage) {
            pageName = nextPageName;
            return;
        }

        savePlaybackPosition();
        if (backgroundAudio) {
            backgroundAudio.pause();
        }
        pageName = nextPageName;
        isMessagePage = nextIsMessagePage;
        track = isMessagePage ? messageTrack : journeyTrack;
        volumeStorageKey = isMessagePage ? "messageVolume" : "journeyVolume";
        positionStorageKey = isMessagePage ? "messagePosition" : "journeyPosition";
        playingStorageKey = isMessagePage ? "messagePlaying" : "journeyPlaying";
        var nextVolume = localStorage.getItem(volumeStorageKey);
        volume = nextVolume === null ? (isMessagePage ? 0.2 : 0.3) : Number(nextVolume);

        if (!backgroundAudio) {
            return;
        }

        backgroundAudio.src = track;
        backgroundAudio.volume = volume;
        backgroundAudio.load();
        backgroundAudio.addEventListener("loadedmetadata", function resumeNewTrack() {
            var storedPosition = Number(localStorage.getItem(positionStorageKey));
            if (Number.isFinite(storedPosition) && storedPosition > 0) {
                backgroundAudio.currentTime = storedPosition;
            }
            playTrack();
        }, { once: true });
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
        var isAllowedMusicPage = isMessagePage || isIndexPage || isStoryPage;
        if (isAllowedMusicPage) {
            playTrack();
        }
    }

    function isInternalPageLink(link) {
        if (!link || link.target === "_blank" || link.hasAttribute("download")) {
            return false;
        }

        var url = new URL(link.href, window.location.href);
        var isMessageNavigation = url.pathname.endsWith("message3.html");
        return url.origin === window.location.origin && (url.pathname.endsWith(".html") && !isMessageNavigation ? true : isMessageNavigation);
    }

    function runPageScripts(pageBody) {
        pageBody.querySelectorAll("script").forEach(function (script) {
            if (script.src && new URL(script.src, window.location.href).pathname.endsWith("/music.js")) {
                return;
            }

            var replacement = document.createElement("script");
            if (script.src) {
                replacement.src = script.src;
                replacement.async = false;
            } else {
                replacement.textContent = script.textContent;
            }
            document.body.append(replacement);
        });
    }

    function navigateWithoutReload(url, addToHistory) {
        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Page could not be loaded");
                }
                return response.text();
            })
            .then(function (html) {
                var nextDocument = new DOMParser().parseFromString(html, "text/html");
                document.title = nextDocument.title;
                document.body.replaceWith(nextDocument.body);
                if (addToHistory) {
                    window.history.pushState({}, "", url);
                }
                setActivePage(url);
                runPageScripts(document.body);
                createMusicControls();
                window.scrollTo(0, 0);
            })
            .catch(function () {
                window.location.href = url;
            });
    }

    document.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (!isInternalPageLink(link)) {
            return;
        }

        var url = new URL(link.href, window.location.href);
        if (url.pathname.endsWith("message3.html")) {
            event.preventDefault();
            event.stopPropagation();
            setActivePage(url);
            if (backgroundAudio) {
                backgroundAudio.play().catch(function () {});
            }
            navigateWithoutReload(link.href, true);
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        if (pageName === "index.html" && localStorage.getItem(playingStorageKey) !== "false" && (!backgroundAudio || backgroundAudio.paused)) {
            playTrack();
        }
        navigateWithoutReload(link.href, true);
    }, true);

    window.addEventListener("popstate", function () {
        navigateWithoutReload(window.location.href, false);
    });

    window.addEventListener("pagehide", savePlaybackPosition);
    createMusicControls();
}());
