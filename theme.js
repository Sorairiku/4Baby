(function () {
    var savedTheme = localStorage.getItem("siteTheme") || "warm";
    var isBlue = savedTheme === "blue";

    document.body.classList.toggle("theme-blue", isBlue);

    var control = document.createElement("div");
    control.className = "theme-control";
    control.innerHTML = '<span class="theme-label">Warm</span><input id="themeSlider" type="range" min="0" max="1" step="1" value="' + (isBlue ? "1" : "0") + '" aria-label="Choose between Warm and Blue themes"><span class="theme-label">Blue</span>';
    document.body.append(control);

    var slider = control.querySelector("#themeSlider");

    function updateTheme(value) {
        var blue = Number(value) === 1;
        document.body.classList.toggle("theme-blue", blue);
        localStorage.setItem("siteTheme", blue ? "blue" : "warm");
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