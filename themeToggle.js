const themeToggleBtn = document.getElementById("theme-toggle")
const themeToggleImg = themeToggleBtn.querySelector("img")



if (localStorage.getItem("theme") == "dark") {
    themeToggleImg.src = "assets/sun.svg"
    document.body.classList.add("dark")
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark")

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark")
        themeToggleImg.src = "assets/sun.svg"
    } else {
        ''
        localStorage.setItem("theme", "light")
        themeToggleImg.src = "assets/moon.svg"
    }
})