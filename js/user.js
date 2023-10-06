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
const settingBox = document.querySelector(".setting")
const settingForm = document.querySelector(".setting form")
updateBtn.addEventListener("click", () => {
    settingBox.classList.toggle("active")
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
const saveBtn = document.querySelector("#save-btn")
settingForm.email.value = currentUser.email

settingForm.addEventListener("submit", (event) => {
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
)

// for deleting account 
const deleteBtn = document.querySelector("#delete-btn")
const cancelBtn = document.querySelector("#cancel-btn")
const confirmDelBtn = document.querySelector(".delete")
const body=document.querySelector("body")
deleteBtn.addEventListener("click", () => {
    const confirmDelBox=document.querySelector(".pop-up-delete")
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
    cancelBtn.addEventListener("click",()=>{
        confirmDelBox.classList.remove("active")
    })
})

// for logging out temporary
const logoutBtn = document.querySelector(".logout")
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser")
    location.assign("http://127.0.0.1:5500/")
})