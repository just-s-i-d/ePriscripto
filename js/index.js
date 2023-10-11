// for the overlay on the sign-in-up container
const signInBtn = document.querySelector("#signIn")
const signUpBtn = document.querySelector("#signUp")
const overlayRight = document.querySelector(".overlay-right")
const overlayLeft = document.querySelector(".overlay-left")
const signUpForm = document.querySelector("#sign-up")
const signInForm = document.querySelector("#sign-in")
const closeLoginBtn = document.querySelector("#close-login")
signInBtn.addEventListener("click", () => {
    setTimeout(() => {
        closeLoginBtn.classList.remove("white")
    }, 100)
    overlayLeft.classList.toggle("active")
    overlayRight.classList.toggle("active")
    signUpForm.reset()
})
signUpBtn.addEventListener("click", () => {
    setTimeout(() => {
        closeLoginBtn.classList.add("white")
    }, 500)
    overlayRight.classList.toggle("active")
    overlayLeft.classList.toggle("active")
    signInForm.reset()
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
const closeBtn = document.querySelector(".login-box-container")
const xBtn = document.querySelector("#close-login")
xBtn.addEventListener("click", () => {
    loginBox.classList.remove("active")
    document.body.classList.remove("noScroll")
})
loginBtn.addEventListener("click", () => {
    loginBox.classList.toggle("active")
    document.body.classList.toggle("noScroll")
})
closeBtn.addEventListener("click", (event) => {
    if (event.target === closeBtn) {
        loginBox.classList.remove("active")
        document.body.classList.remove("noScroll")
    }
})

// for the contact form switch
const sendBtn = document.querySelector("#send")
const resContainer = document.querySelector(".thanks-container")
const contactBox = document.querySelector(".contact-form")

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
const popUp = document.querySelector(".pop-message")
const popContent=document.querySelector(".pop-message .pop-content")
const closePopUp=document.querySelector("#close-toast")
const delay = 2000
const errorName = document.querySelector("#sign-up .error-name")
const errorEmail = document.querySelector("#sign-up .error-email")
const errorPassword = document.querySelector("#sign-up .error-password")
const errorConfirmPassword = document.querySelector("#sign-up .error-confirm-password")

function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name)
}
function validateEmail(name) {
    return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(name)
}
closePopUp.addEventListener("click",()=>{
    popUp.classList.remove("active")
})
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!signUpForm.fullName.value) {
        signUpForm.fullName.classList.add("error")
        errorName.innerText = "Enter your name"
        errorName.classList.add("active")
        setTimeout(() => {
            errorName.classList.remove("active")
            signUpForm.fullName.classList.remove("error")
        }, delay)
    }
    else if (!validateName(signUpForm.fullName.value)) {
        signUpForm.fullName.classList.add("error")
        errorName.innerText = "Enter a valid name"
        errorName.classList.add("active")
        setTimeout(() => {
            signUpForm.fullName.classList.remove("error")
            errorName.classList.remove("active")
        }, delay)
    }
    else if (!signUpForm.email.value) {
        signUpForm.email.classList.add("error")
        errorEmail.innerText = "Enter an email"
        errorEmail.classList.add("active")
        setTimeout(() => {
            signUpForm.email.classList.remove("error")
            errorEmail.classList.remove("active")
        }, delay)
    }
    else if (!validateEmail(signUpForm.email.value)) {
        signUpForm.email.classList.add("error")
        errorEmail.innerText = "Enter a valid email"
        errorEmail.classList.add("active")
        setTimeout(() => {
            signUpForm.email.classList.remove("error")
            errorEmail.classList.remove("active")
        }, delay)
    }
    else if (!signUpForm.password.value) {
        signUpForm.password.classList.add("error")
        errorPassword.innerText = "Enter a password"
        errorPassword.classList.add("active")
        setTimeout(() => {
            signUpForm.password.classList.remove("error")
            errorPassword.classList.remove("active")
        }, delay)
    }
    else if (signUpForm.password.value.length <= 5) {
        signUpForm.password.classList.add("error")
        errorPassword.innerText = "Passoword is too short"
        errorPassword.classList.add("active")
        setTimeout(() => {
            signUpForm.password.classList.remove("error")
            errorPassword.classList.remove("active")
        }, delay)
    }
    else if (!signUpForm.confirmPassword.value) {
        signUpForm.confirmPassword.classList.add("error")
        errorConfirmPassword.innerText = "Confirm password field cannot be empty"
        errorConfirmPassword.classList.add("active")
        setTimeout(() => {
            signUpForm.confirmPassword.classList.remove("error")
            errorConfirmPassword.classList.remove("active")
        }, delay)
    }
    else if (signUpForm.password.value !== signUpForm.confirmPassword.value) {
        signUpForm.confirmPassword.classList.add("error")
        errorConfirmPassword.innerText = "Passowords do not match"
        errorConfirmPassword.classList.add("active")
        setTimeout(() => {
            signUpForm.confirmPassword.classList.remove("error")
            errorConfirmPassword.classList.remove("active")
        }, delay)
    }
    else {
        const userData = {
            fullName: signUpForm.fullName.value.toCapitaliseWord(),
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
            let cursor = store.add(userData)
            cursor.onsuccess = () => {
                const curUser = { email: userData.email, name: userData.fullName }
                sessionStorage.setItem("currentUser", JSON.stringify(curUser))
                signUpForm.reset()
                popContent.innerText = "Logging in"
                popUp.classList.add("active")
                popUp.classList.add("success")
                setTimeout(() => {
                    popUp.classList.remove("active")
                    popUp.classList.remove("success")
                    location.assign("http://127.0.0.1:5500/user-dashboard-html/settings.html")
                }, 2000)

            }
            cursor.onerror = (e) => {
                let error = e.target.error.message
                if (error == "Key already exists in the object store.") {
                    popUp.innerText = "Email already Exists"
                    popUp.classList.add("active")
                    popUp.classList.add("error")
                    setTimeout(() => {
                        popUp.classList.remove("active")
                        popUp.classList.remove("error")
                    }, 2000)
                    signUpForm.reset()
                }
            }
        }
    }


})

// for sign in 
const errorEmailSignIn = document.querySelector("#sign-in .error-email")
const errorPasswordSignIn = document.querySelector("#sign-in .error-password")
signInForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (!signInForm.email.value) {
        signInForm.email.classList.add("error")
        errorEmailSignIn.innerText = "Enter an email"
        errorEmailSignIn.classList.add("active")
        setTimeout(() => {
            signInForm.email.classList.remove("error")
            errorEmailSignIn.classList.remove("active")
        }, delay)
    }
    else if (!signInForm.password.value) {
        signInForm.password.classList.add("error")
        errorPasswordSignIn.innerText = "Enter a password"
        errorPasswordSignIn.classList.add("active")
        setTimeout(() => {
            signInForm.password.classList.remove("error")
            errorPasswordSignIn.classList.remove("active")
        }, delay)
    }
    else if (signInForm.password.value.length <= 5) {
        signInForm.password.classList.add("error")
        errorPasswordSignIn.innerText = "Passoword is too short"
        errorPasswordSignIn.classList.add("active")
        setTimeout(() => {
            signInForm.password.classList.remove("error")
            errorPasswordSignIn.classList.remove("active")
        }, delay)
    }
    else {
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
                if (curRes) {
                    if (userLoginData.password === curRes.password) {
                        const curUser = { email: curRes.email, name: curRes.fullName }
                        sessionStorage.setItem("currentUser", JSON.stringify(curUser))
                        signInForm.reset()
                        popContent.innerText = "Logging in"
                        popUp.classList.add("active")
                        popUp.classList.add("success")
                        setTimeout(() => {
                            popUp.classList.remove("active")
                            popUp.classList.remove("success")
                            location.assign("http://127.0.0.1:5500/user-dashboard-html/settings.html")
                        }, 2000)
                    }
                    else {
                        popUp.innerText = "Wrong password"
                        popUp.classList.add("active")
                        popUp.classList.add("error")
                        setTimeout(() => {
                            popUp.classList.remove("active")
                            popUp.classList.remove("error")
                        }, 2000)
                    }
                }
                else {
                    popContent.innerText = "No users found"
                    popUp.classList.add("active")
                    popUp.classList.add("error")
                    setTimeout(() => {
                        popUp.classList.remove("active")
                        popUp.classList.remove("error")
                    }, 2000)
                    signInForm.reset()
                }
            }
        }
    }
}
)
//for logging out
const logoutBtn = document.querySelector(".logout")
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser")
    location.reload()
})

// for login and login button in nav bar
const profileBtn = document.querySelector(".profile")
if (sessionStorage.getItem("currentUser")) {
    loginBtn.classList.add("not-active")
    logoutBtn.classList.remove("not-active")
    profileBtn.classList.remove("not-active")
}

// for slider in testimonial section
const indicatorBtn = document.querySelectorAll(".indicator-btn")
const sliderRow = document.querySelector(".slider-row")
const sliderCol = document.querySelector(".testimonial")
var width = 1200
const calWidth = () => {
    width = sliderCol.offsetWidth
    console.log("change")
}

indicatorBtn[0].addEventListener("click", function () {
    calWidth()
    sliderRow.style.transform = "translateX(0px)"
    for (let i = 0; i < 3; i++) {
        indicatorBtn[i].classList.remove("active")
    }
    this.classList.add("active")
})
indicatorBtn[1].addEventListener("click", function () {
    calWidth()
    sliderRow.style.transform = `translateX(-${width}px)`
    for (let i = 0; i < 3; i++) {
        indicatorBtn[i].classList.remove("active")
    }
    this.classList.add("active")
})
indicatorBtn[2].addEventListener("click", function () {
    calWidth()
    sliderRow.style.transform = `translateX(-${width * 2}px)`
    for (let i = 0; i < 3; i++) {
        indicatorBtn[i].classList.remove("active")
    }
    this.classList.add("active")
})