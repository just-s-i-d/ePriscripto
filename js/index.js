import { inputError, passwordCheck, toast } from "./common.js"
// for json server
const url = "http://localhost:3000/users"


// for the overlay on the sign-in-up container
const overlayRight = document.querySelector(".overlay-right")
const overlayLeft = document.querySelector(".overlay-left")
const signUpForm = document.querySelector("#sign-up")
const signInForm = document.querySelector("#sign-in")
const closeLoginBtn = document.querySelector("#close-login")
const signInBtn = document.querySelector("button#signIn")
const signUpBtn = document.querySelector("button#signUp")
function showSignIn() {
    closeLoginBtn.classList.remove("white")
    overlayLeft.classList.toggle("active")
    overlayRight.classList.toggle("active")
    signUpForm.reset()
}
function showSignUp() {
    setTimeout(() => {
        closeLoginBtn.classList.add("white")
    }, 500)
    overlayRight.classList.toggle("active")
    overlayLeft.classList.toggle("active")
    signInForm.reset()
}
signInBtn.onclick = showSignIn
signUpBtn.onclick = showSignUp
// for drop down menu
const dropDown = document.querySelector(".drop-down-menu")

function openDropDown() {
    dropDown.classList.toggle("active")
}

// for showing and hiding the login box
const loginBtn = document.querySelectorAll(".login")
const loginBox = document.querySelector(".login-box-container")
const closeBtn = document.querySelector(".login-box-container")


function closeLoginModal() {
    loginBox.classList.remove("active")
    document.body.classList.remove("noScroll")
}
function openLoginModal() {
    loginBox.classList.toggle("active")
    document.body.classList.toggle("noScroll")
}
loginBtn.forEach(btn => {
    btn.onclick = openLoginModal
})
closeLoginBtn.onclick=closeLoginModal
closeBtn.onclick = (event) => {
    if (event.target === closeBtn) {
        closeLoginModal()
    }
}

// for the contact form switch
const sendBtn = document.querySelector("#send")
const resContainer = document.querySelector(".thanks-container")
const contactBox = document.querySelector(".contact-form")

sendBtn.onclick = (event) => {
    event.preventDefault()
    resContainer.classList.toggle("active")
    contactBox.classList.toggle("not-active")
    setTimeout(() => {
        resContainer.classList.toggle("active")
        contactBox.classList.toggle("not-active")
    }, 2000)
}

// for the reveal on scroll effect
window.addEventListener("scroll", reveal)
function reveal() {
    if (window.innerWidth < 700) {
        var revealPoint = 0
    }
    else if (window.innerWidth < 1080) {
        var revealPoint = 60
    }
    else {
        var revealPoint = 100
    }
    var reveals = document.querySelectorAll(".reveal")
    for (let i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight
        var revealTop = reveals[i].getBoundingClientRect().top

        if (revealTop < windowheight - revealPoint) {
            reveals[i].classList.add("active")
        }
        else {
            reveals[i].classList.remove("active")
        }
    }
}

// for capitalising adding a custom method to string
String.prototype.toCapitaliseWord = function () {
    let words = this.split(" ")
    const capitalisedWords = words.map(word => {
        return word[0].toUpperCase() + word.slice(1)
    })
    return capitalisedWords.join(" ")
}


// for sign up

const errorName = document.querySelector("#sign-up .error-name")
const errorEmail = document.querySelector("#sign-up .error-email")
const errorPassword = document.querySelector("#sign-up .error-password")
const errorConfirmPassword = document.querySelector("#sign-up .error-confirm-password")
const closePopUp = document.querySelector("#close-toast")
function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name)
}
function validateEmail(name) {
    return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(name)
}
closePopUp.onclick = () => {
    popUp.classList.remove("active")
}
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!signUpForm.fullName.value.trim()) {
        inputError(signUpForm.fullName, errorName, "Enter your name")
    }
    else if (!validateName(signUpForm.fullName.value.trim())) {
        inputError(signUpForm.fullName, errorName, "Special characters not allowed")
    }
    else if (signUpForm.fullName.value.trim().length > 20) {
        inputError(signUpForm.fullName, errorName, "Maximum 20 characters allowed")
    }
    else if (!signUpForm.email.value.trim()) {
        inputError(signUpForm.email, errorEmail, "Enter an email")
    }
    else if (!validateEmail(signUpForm.email.value.trim())) {
        inputError(signUpForm.email, errorEmail, "Enter a valid email")
    }
    else if (!passwordCheck(signUpForm.password, errorPassword)) {

    }
    else if (!passwordCheck(signUpForm.confirmPassword, errorConfirmPassword)) {

    }
    else if (signUpForm.password.value !== signUpForm.confirmPassword.value) {
        inputError(signUpForm.confirmPassword, errorConfirmPassword, "Passwords does not match")
    }
    else {
        const email = signUpForm.email.value.trim()
        let idb = indexedDB.open("crude", 1)
        idb.onupgradeneeded = () => {
            let res = idb.result
            res.createObjectStore("users", { keyPath: "email" })
        }
        idb.onsuccess = () => {
            fetch(url, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ email })
            }).then(response => response.json())
                .then(data => {
                    const userData = {
                        fullName: signUpForm.fullName.value.trim().toCapitaliseWord(),
                        email,
                        id: data.id,
                        password: signUpForm.password.value,
                    }
                    let res = idb.result
                    let tx = res.transaction("users", "readwrite")
                    let store = tx.objectStore("users")
                    let cursor = store.add(userData)
                    cursor.onsuccess = () => {
                        const { email, name: fullName, id } = userData
                        const curUser = { email, name, id }
                        sessionStorage.setItem("currentUser", JSON.stringify(curUser))
                        signUpForm.reset()
                        toast("Logging in", "success", "http://127.0.0.1:5500/user-dashboard-html/settings.html")
                    }
                    cursor.onerror = (e) => {
                        let error = e.target.error.message
                        if (error == "Key already exists in the object store.") {
                            toast("Email already exists", "error")
                            signUpForm.reset()
                        }
                    }
                }).catch(e => {
                    toast("No response from the server")
                })
        }
        idb.onerror = () => {
            toast("There is an error in the database", "error")
        }
    }
})

// for sign in 
const errorEmailSignIn = document.querySelector("#sign-in .error-email")
const errorPasswordSignIn = document.querySelector("#sign-in .error-password")
signInForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!signInForm.email.value) {
        inputError(signInForm.email,errorEmailSignIn,"Enter an email")
    }
    else if (!validateEmail(signInForm.email.value.trim())) {
        inputError(signInForm.email, errorEmail, "Enter a valid email")
    }
    else if(!passwordCheck(signInForm.password,errorPasswordSignIn)){

    }
    else {
        const userLoginData = {
            email: signInForm.email.value,
            password: signInForm.password.value
        }
        let idb = indexedDB.open("crude", 1)
        idb.onupgradeneeded = () => {
            let res = idb.result
            res.createObjectStore("users", { keyPath: "email" })
        }
        idb.onsuccess = () => {
            let res = idb.result
            let tx
            try {
                tx = res.transaction("users", "readonly")
            }
            catch (error) {
                toast("No users found","error")
                signInForm.reset()
            }
            let store = tx.objectStore("users")
            let cursor = store.get(userLoginData.email)
            cursor.onsuccess = () => {
                let curRes = cursor.result
                if (curRes) {
                    if (userLoginData.password === curRes.password) {
                        const curUser = { email: curRes.email, name: curRes.fullName, id: curRes.id }
                        sessionStorage.setItem("currentUser", JSON.stringify(curUser))
                        signInForm.reset()
                        toast("Logging in","success","http://127.0.0.1:5500/user-dashboard-html/settings.html")
                    }
                    else {
                        toast("Wrong password","error")
                    }
                }
                else {
                    toast("No users found","error")
                    signInForm.reset()
                }
            }
        }
        idb.onerror = () => {
            toast("Couldn't find your account.","error")
        }
    }
}
)

// for login and login button in nav bar
const navLoginBtn=document.querySelector(".navbar-container .login")
const navLogoutBtn=document.querySelector(".navbar-container .logout")
const profileBtn = document.querySelector(".profile")
if (sessionStorage.getItem("currentUser")) {
    navLoginBtn.classList.add("not-active")
    navLogoutBtn.classList.remove("not-active")
    profileBtn.classList.remove("not-active")
}

// for slider in testimonial section
const indicatorBtn = document.querySelectorAll(".indicator-btn")
const sliderRow = document.querySelector(".slider-row")
const sliderCol = document.querySelector(".testimonial")
var width = 1200
const calWidth = () => {
    width = sliderCol.offsetWidth
}
window.onresize = calWidth
indicatorBtn[0].onclick = function () {
    calWidth()
    sliderRow.style.transform = "translateX(0px)"
    for (let i = 0; i < 3; i++) {
        indicatorBtn[i].classList.remove("active")
    }
    this.classList.add("active")
}
indicatorBtn[1].onclick = function () {
    calWidth()
    sliderRow.style.transform = `translateX(-${width}px)`
    for (let i = 0; i < 3; i++) {
        indicatorBtn[i].classList.remove("active")
    }
    this.classList.add("active")
}
indicatorBtn[2].onclick = function () {
    calWidth()
    sliderRow.style.transform = `translateX(-${width * 2}px)`
    for (let i = 0; i < 3; i++) {
        indicatorBtn[i].classList.remove("active")
    }
    this.classList.add("active")
}