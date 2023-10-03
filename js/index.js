const signInBtn = document.querySelector("#signIn")
const signUpBtn = document.querySelector("#signUp")
const overlayRight = document.querySelector(".overlay-right")
const overlayLeft = document.querySelector(".overlay-left")

const loginBtn = document.querySelector(".login")
const loginBox = document.querySelector(".login-box-container")

const sendBtn = document.querySelector("#send")
const resContainer = document.querySelector(".thanks-container")
const contactBox = document.querySelector(".contact-main-container")
loginBtn.addEventListener("click", () => {
    loginBox.classList.toggle("active")
})
signInBtn.addEventListener("click", () => {
    overlayLeft.classList.toggle("active")
    overlayRight.classList.toggle("active")
})

signUpBtn.addEventListener("click", () => {
    overlayRight.classList.toggle("active")
    overlayLeft.classList.toggle("active")
    console.log("hello")
})

sendBtn.addEventListener("click", (event) => {
    event.preventDefault()
    resContainer.style.display = "block"
    contactBox.style.display = "none"
    setTimeout(() => {
        resContainer.style.display = "none"
        contactBox.style.display = "block"
    }, 2000)
})