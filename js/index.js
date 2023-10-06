// for the overlay on the sign-in-up container
const signInBtn = document.querySelector("#signIn")
const signUpBtn = document.querySelector("#signUp")
const overlayRight = document.querySelector(".overlay-right")
const overlayLeft = document.querySelector(".overlay-left")
const signUpForm = document.querySelector("#sign-up")
const signInForm = document.querySelector("#sign-in")

signInBtn.addEventListener("click", () => {
    overlayLeft.classList.toggle("active")
    overlayRight.classList.toggle("active")
    signUpForm.reset()
})
signUpBtn.addEventListener("click", () => {
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
const delay = 2000
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(signUpForm)
    if (!signUpForm.fullName.value) {
        popUp.innerText = "Enter your name"
        popUp.classList.add("active")
        setTimeout(() => {
            popUp.classList.remove("active")
        }, delay)
    }
    else if (!signUpForm.email.value) {
        popUp.innerText = "Enter an email"
        popUp.classList.add("active")
        setTimeout(() => {
            popUp.classList.remove("active")
        }, delay)
    }
    else if (!signUpForm.password.value) {
        popUp.innerText = "Enter a password"
        popUp.classList.add("active")
        setTimeout(() => {
            popUp.classList.remove("active")
        }, delay)
    }
    else if (signUpForm.password.value.length <= 5) {
        popUp.innerText = "Passoword is too short"
        popUp.classList.add("active")
        setTimeout(() => {
            popUp.classList.remove("active")
        }, delay)
    }
    else if (!signUpForm.confirmPassword.value) {
        popUp.innerText = "Confirm password field empty"
        popUp.classList.add("active")
        setTimeout(() => {
            popUp.classList.remove("active")
        }, delay)
    }
    else if (signUpForm.password.value !== signUpForm.confirmPassword.value) {
        popUp.innerText = "Passowords do not match"
        popUp.classList.add("active")
        setTimeout(() => {
            popUp.classList.remove("active")
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
                let curRes = cursor.result
                const curUser = { email: userData.email, name: userData.fullName }
                sessionStorage.setItem("currentUser", JSON.stringify(curUser))
                signUpForm.reset()
                location.assign("http://127.0.0.1:5500/user-dashboard-html/settings.html")
            }
            cursor.onerror = (e) => {
                let error = e.target.error.message
                if (error == "Key already exists in the object store.") {
                    popUp.innerText = "Email already Exists"
                    popUp.classList.add("active")
                    setTimeout(() => {
                        popUp.classList.remove("active")
                    }, 2000)
                    signUpForm.reset()
                }
            }
        }
    }


})

// for sign in 

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
            if (curRes) {
                if (userLoginData.password === curRes.password) {
                    const curUser = { email: curRes.email, name: curRes.fullName }
                    sessionStorage.setItem("currentUser", JSON.stringify(curUser))
                    signInForm.reset()
                    location.assign("http://127.0.0.1:5500/user-dashboard-html/settings.html")
                }
                else {
                    popUp.classList.add("active")
                    setTimeout(() => {
                        popUp.classList.remove("active")
                    }, 2000)
                }
            }
            else {
                popUp.innerText = "No users found"
                popUp.classList.add("active")
                setTimeout(() => {
                    popUp.classList.remove("active")
                }, 2000)
                signInForm.reset()
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

