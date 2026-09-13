(function () {
    var savedTheme = localStorage.getItem("siteTheme") || "warm";
    var isBlue = savedTheme === "blue";

    document.body.classList.toggle("theme-blue", isBlue);

    var control = document.createElement("div");
    control.className = "theme-control";
    control.innerHTML = '<label for="themeSlider">Theme</label><input id="themeSlider" type="range" min="0" max="1" step="1" value="' + (isBlue ? "1" : "0") + '" aria-label="Choose site theme"><span class="theme-name" aria-live="polite"></span>';
    document.body.append(control);

    var slider = control.querySelector("#themeSlider");
    var name = control.querySelector(".theme-name");

    function updateTheme(value) {
        var blue = Number(value) === 1;
        document.body.classList.toggle("theme-blue", blue);
        localStorage.setItem("siteTheme", blue ? "blue" : "warm");
        name.textContent = blue ? "Blue" : "Warm";

        var welcomePhoto = document.querySelector(".welcome-photo");
        if (welcomePhoto) {
            welcomePhoto.src = blue ? "images/Us/Us57.jpg" : "images/menbaby.JPG";
        }
    }

    slider.addEventListener("input", function () {
        updateTheme(slider.value);
    });
    updateTheme(slider.value);
}());