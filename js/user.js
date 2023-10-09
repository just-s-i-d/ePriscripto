// for checking if user is logged in or not
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
if (!currentUser) {
    location.assign("http://127.0.0.1:5500/")
}
// for string prototype
String.prototype.toCapitaliseWord = function () {
    let words = this.split(" ")
    const capitalisedWords = words.map(word => {
        return word[0].toUpperCase() + word.slice(1)
    })
    return capitalisedWords.join(" ")
}
// for name pattern matching 
function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name)
}
// for showing details of user
const userDetails = document.querySelectorAll(".user-details h3")
let idb = indexedDB.open("crude", 1)
idb.onsuccess = () => {
    let res = idb.result
    let tx = res.transaction("users", "readonly")
    let store = tx.objectStore("users")
    let cursor = store.get(currentUser.email)
    cursor.onsuccess = () => {
        let userData = cursor.result
        console.log(userData)
        sessionStorage.setItem("currentUser", JSON.stringify({ email: userData.email, name: userData.fullName }))
        userDetails[0].innerHTML = userData.email
        userDetails[1].innerHTML = userData.fullName
        if (userData.age) {
            userDetails[2].innerHTML = userData.age
            userDetails[3].innerHTML = userData.gender
        }
    }
}

// for update details card animation
const updateBtn = document.querySelector("#update-btn")
const userDetailsCard = document.querySelector("div.user-details")
const settingBox = document.querySelector(".setting")
const settingForm = document.querySelector(".setting form")
updateBtn.addEventListener("click", () => {
    userDetailsCard.classList.add("not-active")
    settingBox.classList.add("active")
    let idb = indexedDB.open("crude", 1)
    idb.onsuccess = () => {
        let res = idb.result
        let tx = res.transaction("users", "readonly")
        let store = tx.objectStore("users")
        let cursor = store.get(currentUser.email)
        cursor.onsuccess = () => {
            let user = cursor.result
            if (user.age) {
                settingForm.age.value = user.age
                settingForm.gender.value = user.gender
            }
            settingForm.name.value = user.fullName
            settingForm.password.value = user.password
        }
    }
})

//for updating details of user
const delay = 3000
const saveBtn = document.querySelector("#save-btn")
const cancelDetailsBtn = document.querySelector("#cancel-details-btn")
const errorEmail = document.querySelector(".form-field .error-email")
const errorName = document.querySelector(".form-field .error-name")
const errorAge = document.querySelector(".form-field .error-age")
const errorGender = document.querySelector(".form-field .error-gender")
cancelDetailsBtn.addEventListener("click", (e) => {
    e.preventDefault()
    userDetailsCard.classList.remove("not-active")
    settingBox.classList.remove("active")
})
settingForm.email.value = currentUser.email
settingForm.email.addEventListener("click", () => {
    settingForm.email.classList.add("error")
    errorEmail.innerText = "Email cannot be changed"
    errorEmail.classList.add("active")
    setTimeout(() => {
        errorEmail.classList.remove("active")
        settingForm.email.classList.remove("error")
        settingForm.email.value = currentUser.email
    }, delay)
})
settingForm.addEventListener("submit", (event) => {
    event.preventDefault()
    // if (!settingForm.email.value !== currentUser.email) {
    //     settingForm.email.classList.add("error")
    //     errorEmail.innerText = "Email cannot be changed"
    //     errorEmail.classList.add("active")
    //     setTimeout(() => {
    //         errorEmail.classList.remove("active")
    //         settingForm.email.classList.remove("error")
    //         settingForm.email.value = currentUser.email
    //     }, delay)
    // }
    if (!settingForm.name.value) {
        settingForm.name.classList.add("error")
        errorName.innerText = "Enter your name"
        errorName.classList.add("active")
        setTimeout(() => {
            errorName.classList.remove("active")
            settingForm.name.classList.remove("error")
        }, delay)
    }
    else if (!validateName(settingForm.name.value)) {
        settingForm.name.classList.add("error")
        errorName.innerText = "Enter a valid name"
        errorName.classList.add("active")
        setTimeout(() => {
            settingForm.name.classList.remove("error")
            errorName.classList.remove("active")
        }, delay)
    }
    else if (!settingForm.age.value) {
        settingForm.age.classList.add("error")
        errorAge.innerText = "Enter an age"
        errorAge.classList.add("active")
        setTimeout(() => {
            settingForm.age.classList.remove("error")
            errorAge.classList.remove("active")
        }, delay)
    }
    else if (settingForm.age.value < 18 || settingForm.age.value > 50) {
        settingForm.age.classList.add("error")
        errorAge.innerText = "Enter an age between 18 to 50"
        errorAge.classList.add("active")
        setTimeout(() => {
            settingForm.age.classList.remove("error")
            errorAge.classList.remove("active")
        }, delay)
    }
    else if (settingForm.gender.value == "Select your gender") {
        settingForm.gender.classList.add("error")
        errorGender.innerText = "Select a gender"
        errorGender.classList.add("active")
        setTimeout(() => {
            settingForm.gender.classList.remove("error")
            errorGender.classList.remove("active")
        }, delay)
    }
    else {
        event.preventDefault()
        const userData = {
            email: settingForm.email.value,
            fullName: settingForm.name.value.toCapitaliseWord(),
            age: settingForm.age.value,
            gender: settingForm.gender.value,
            password: settingForm.password.value
        }
        let idb = indexedDB.open("crude", 1)
        idb.onsuccess = () => {
            let tx = idb.result.transaction("users", "readwrite")
            let store = tx.objectStore("users")
            let cursor = store.put(userData)
            cursor.onsuccess = () => {
                location.reload()
            }
        }
    }
}
)

// for deleting account 
const deleteBtn = document.querySelector("#delete-btn")
const cancelBtn = document.querySelector("#cancel-btn")
const confirmDelBtn = document.querySelector(".delete")
const body = document.querySelector("body")
deleteBtn.addEventListener("click", () => {
    const confirmDelBox = document.querySelector(".pop-up-delete")
    confirmDelBox.classList.add("active")
    confirmDelBtn.addEventListener("click", () => {
        let idb = indexedDB.open("crude", 1)
        idb.onsuccess = () => {
            let tx = idb.result.transaction("users", "readwrite")
            let store = tx.objectStore("users")
            let cursor = store.delete(currentUser.email)
            cursor.onsuccess = () => {
                sessionStorage.removeItem("currentUser")
                location.assign("http://127.0.0.1:5500/")
            }
        }
    })
    cancelBtn.addEventListener("click", () => {
        confirmDelBox.classList.remove("active")
    })
})

// for logging out temporary
const logoutBtn = document.querySelector(".logout")
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser")
    location.assign("http://127.0.0.1:5500/")
})

// for add new prescription
const prescriptionForm = document.querySelector("#prescription-form")
prescriptionForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const newPresData = {
        doctorName: prescriptionForm.docName.value,
        hospitalName: prescriptionForm.hospitalName.value,
        prescriptionDate: prescriptionForm.prescriptionDate.value,
        prescriptionImg: prescriptionForm.imgLink.value
    }
    console.log(newPresData)
})