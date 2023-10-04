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

// for drop down menu
const menuIcon = document.querySelector(".menu-icon")
const dropDown = document.querySelector(".drop-down-menu")

menuIcon.addEventListener("click", () => {
    dropDown.classList.toggle("active")
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
        var revealTop = reveals[i].getBoundingClientRect().top
        var revealPoint = 80
        if (revealTop < windowheight - revealPoint) {
            reveals[i].classList.add("active")
        }
        else {
            reveals[i].classList.remove("active")
        }
    }
}

// for sign up
const signUpForm = document.querySelector("#sign-up")
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const userData = {
        fullName: signUpForm.fullName.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value,
    }

    let idb = indexedDB.open("crude", 1)
    idb.onupgradeneeded = () => {
        let res = idb.result
        res.createObjectStore("users", { keyPath: "email" })
    }
    idb.onsuccess = () => {
        let res = idb.result
        let tx = res.transaction("users", "readwrite")
        let store = tx.objectStore("users")
        store.add(userData)
    }
    idb.error = (e) => {
        console.log(e)
    }
})

const signInForm = document.querySelector("#sign-in")
signInForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const userLoginData = {
        email: signInForm.email.value,
        password: signInForm.password.value
    }
    let idb = indexedDB.open("crude", 1)
    idb.onsuccess = () => {
        let res = idb.result
        let tx = res.transaction("users", "readonly")
        let store = tx.objectStore("users")
        let cursor = store.get(userLoginData.email)
        cursor.onsuccess = () => {
            let curRes = cursor.result
            if (userLoginData.password === curRes.password)
            {
                console.log("correct")
            }
            else{
                console.log("wrong password")
            }
        }
    }
})
