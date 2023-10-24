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
window.onload = () => {
    let idb = indexedDB.open("crude", 1)
    idb.onsuccess = () => {
        let res = idb.result
        let tx = res.transaction("users", "readonly")
        let store = tx.objectStore("users")
        let cursor = store.get(currentUser.email)
        cursor.onsuccess = () => {
            let userData = cursor.result
            const { email, fullName, id } = userData
            sessionStorage.setItem("currentUser", JSON.stringify({ email, fullName, id }))
            userDetails[0].innerHTML = email
            userDetails[1].innerHTML = fullName
            if (userData.age) {
                userDetails[2].innerHTML = userData.age
                userDetails[3].innerHTML = userData.gender
            }
        }
        cursor.onerror = () => {
            toast("Cannot get your details", "error", "reload")
        }
    }
}

// for update details card animation

const updateBtn = document.querySelector("#update-btn")
const userDetailsCard = document.querySelector("div.user-details")
const settingBox = document.querySelector(".setting")
const settingForm = document.querySelector(".setting form")
function openUserDetailsCard() {
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
        }
        cursor.onerror = () => {
            toast("Cannot get your details", "error", "reload")
        }
    }
}
updateBtn.onclick = openUserDetailsCard
//for updating details of user
const closePopUp = document.querySelector("#close-toast")
const saveBtn = document.querySelector("#save-btn")
const cancelDetailsBtn = document.querySelector("#cancel-details-btn")
const errorEmail = document.querySelector(".form-field .error-email")
const errorName = document.querySelector(".form-field .error-name")
const errorAge = document.querySelector(".form-field .error-age")
const errorGender = document.querySelector(".form-field .error-gender")

function closeUserDetailsCard(event) {
    event.preventDefault()
    userDetailsCard.classList.remove("not-active")
    settingBox.classList.remove("active")
}
settingForm.email.value = currentUser.email
function onEmailChange() {
    inputError(settingForm.email, errorEmail, "Email cannot be changed")
}
function onSettingFormSubmit(event) {
    event.preventDefault()
    if (!settingForm.name.value.trim()) {
        inputError(settingForm.name, errorName, "Enter your name")
    }
    else if (!validateName(settingForm.name.value)) {
        inputError(settingForm.name, errorName, "Special characters not allowed")
    }
    else if (!settingForm.age.value) {
        inputError(settingForm.age, errorAge, "Enter an age")
    }
    else if (settingForm.age.value < 18 || settingForm.age.value > 50) {
        inputError(settingForm.age, errorAge, "Enter an age between 18 to 50")
    }
    else if (settingForm.gender.value == "Select your gender") {
        inputError(settingForm.gender, errorGender, "Select a gender")
    }
    else {
        const userData = {
            email: settingForm.email.value,
            fullName: settingForm.name.value.trim().toCapitaliseWord(),
            age: settingForm.age.value,
            gender: settingForm.gender.value,
        }
        let idb = indexedDB.open("crude", 1)
        idb.onsuccess = () => {
            let tx = idb.result.transaction("users", "readwrite")
            let store = tx.objectStore("users")
            let cursor = store.get(currentUser.email)
            cursor.onsuccess = () => {
                let curUser = cursor.result
                const newUserData = {
                    ...curUser, ...userData
                }
                let res = store.put(newUserData)
                res.onsuccess = () => {
                    toast("User details Updated", "success", "reload")
                }
            }
        }
    }
}
settingForm.onsubmit = onSettingFormSubmit
cancelDetailsBtn.onclick = closeUserDetailsCard
settingForm.email.onchange = onEmailChange

// for deleting account 
// for json server
const url = "http://localhost:3000/users"
async function deleteUser(userId) {
    try {
        const response = await fetch(`${url}/${userId}`, {
            headers: { "Accept": "application/json" },
            method: "DELETE",
        })
        if (!response.ok) {
            toast("Account cannot be deleted","error")
        }
        else {
            return response.json()
        }
    } catch {
        toast("No response from the server","error")
        return
    }
}
const deleteBtn = document.querySelector("#delete-btn")
const cancelBtn = document.querySelector("#cancel-btn")
const confirmDelBtn = document.querySelector(".delete")

deleteBtn.onclick = () => {
    const confirmDelBox = document.querySelector(".pop-up-delete")
    confirmDelBox.classList.add("active")
    confirmDelBtn.onclick = () => {
        let idb = indexedDB.open("crude", 1)
        idb.onsuccess = () => {
            let tx = idb.result.transaction("users", "readwrite")
            let store = tx.objectStore("users")
            let cursor = store.get(currentUser.email)
            let res = store.delete(currentUser.email)
            cursor.onsuccess = () => {
                let userDetails = cursor.result
                deleteUser(userDetails.id)
                    .then(response => {
                        
                    }).catch(()=>{
                        toast("Account was not deleted","error")
                        return
                    })
            }
            res.onsuccess = () => {
                toast("Account deleted","success","http://127.0.0.1:5500/")
                sessionStorage.removeItem("currentUser")
            }
            res.onerror = () => {
                toast("Account was not deleted","error","reload")
            }
        }
    }
    cancelBtn.onclick = () => {
        confirmDelBox.classList.remove("active")
    }
}
