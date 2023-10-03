// for the overlay on the sign-in-up container
const signInBtn = document.querySelector("#signIn")
const signUpBtn = document.querySelector("#signUp")
const overlayRight = document.querySelector(".overlay-right")
const overlayLeft = document.querySelector(".overlay-left")

signInBtn.addEventListener("click", () => {
    overlayLeft.classList.toggle("active")
    overlayRight.classList.toggle("active")
})
signUpBtn.addEventListener("click", () => {
    overlayRight.classList.toggle("active")
    overlayLeft.classList.toggle("active")
    console.log("hello")
})

// for showing and hiding the login box
const loginBtn = document.querySelector(".login")
const loginBox = document.querySelector(".login-box-container")
loginBtn.addEventListener("click", () => {
    loginBox.classList.toggle("active")
})

// for the contact form switch
const sendBtn = document.querySelector("#send")
const resContainer = document.querySelector(".thanks-container")
const contactBox = document.querySelector(".contact-main-container")
sendBtn.addEventListener("click", (event) => {
    event.preventDefault()
    resContainer.classList.toggle("active")
    contactBox.classList.toggle("not-active")
    setTimeout(() => {
        resContainer.classList.toggle("active")
        contactBox.classList.toggle("not-active")
    }, 2000)
})

// for the reveal on scroll effect
window.addEventListener("scroll", reveal)
function reveal() {
    var reveals = document.querySelectorAll(".reveal")
    for (let i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight
        console.log(reveals[i])
        var revealTop = reveals[i].getBoundingClientRect().top
        var revealPoint = 150
        if (revealTop < windowheight - revealPoint) {
            reveals[i].classList.add("active")
        }
        else {
            reveals[i].classList.remove("active")
        }
    }
}
