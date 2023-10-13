const delay = 2000
//for showing error for form fields
function inputError(errorField, error, errorText) {
    errorField.classList.add("error")
    error.innerText = errorText
    error.classList.add("active")
    setTimeout(() => {
        error.classList.remove("active")
        errorField.classList.remove("error")
    }, delay)
}

// for toast messages
const popUp = document.querySelector(".pop-message")
const popContent = document.querySelector(".pop-message .pop-content")

function toast(content, type, redirect) {
    popContent.innerText = content
    popUp.classList.add("active")
    popUp.classList.add(type)
    setTimeout(() => {
        popUp.classList.remove("active")
        popUp.classList.remove(type)
        if (redirect === "reload") {
            location.reload()
        }
        else {
            redirect && location.assign(redirect)
        }
    }, delay)
}
// for password validations
function passwordCheck(password, errorPassword) {
    if (!password.value) {
        inputError(password, errorPassword, "Enter a password")
    }
    else if (password.value.length <= 5) {
        inputError(password, errorPassword, "Passoword length should be between 6 to 16")
    }
    else if (password.value.length > 16) {
        inputError(password, errorPassword, "Passoword length should be between 6 to 16")
    } else {
        return true
    }
}

// for logging out
const logoutBtns = document.querySelectorAll(".logout")
logoutBtns.forEach(btn => {
    btn.onclick = () => {
        toast("Logging out", "success", "reload")
        sessionStorage.removeItem("currentUser")
    }
})

export { inputError, toast, passwordCheck }