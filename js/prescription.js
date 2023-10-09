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
function validateHospitalName(name) {
    return /^[A-Za-z\s\.'-]+$/.test(name)
}
function validateUrl(url) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url)
}
// for add new prescription
const delay = 3000
const errorName = document.querySelector(".form-field .error-name")
const errorHospitalName = document.querySelector(".form-field .error-hospital-name")
const errorDate = document.querySelector(".form-field .error-date")
const errorImg = document.querySelector(".form-field .error-img")
const prescriptionForm = document.querySelector("#prescription-form")
prescriptionForm.addEventListener("submit", (event) => {
    event.preventDefault()
    if (!prescriptionForm.docName.value) {
        prescriptionForm.docName.classList.add("error")
        errorName.innerText = "Enter your name"
        errorName.classList.add("active")
        setTimeout(() => {
            errorName.classList.remove("active")
            prescriptionForm.docName.classList.remove("error")
        }, delay)
    }
    else if (!validateName(prescriptionForm.docName.value)) {
        prescriptionForm.docName.classList.add("error")
        errorName.innerText = "Enter a valid name"
        errorName.classList.add("active")
        setTimeout(() => {
            prescriptionForm.docName.classList.remove("error")
            errorName.classList.remove("active")
        }, delay)
    }
    else if (!prescriptionForm.hospitalName.value) {
        prescriptionForm.hospitalName.classList.add("error")
        errorHospitalName.innerText = "Enter hospital name"
        errorHospitalName.classList.add("active")
        setTimeout(() => {
            errorHospitalName.classList.remove("active")
            prescriptionForm.hospitalName.classList.remove("error")
        }, delay)
    }
    else if (!validateHospitalName(prescriptionForm.hospitalName.value)) {
        prescriptionForm.hospitalName.classList.add("error")
        errorHospitalName.innerText = "Enter a valid hospital name"
        errorHospitalName.classList.add("active")
        setTimeout(() => {
            prescriptionForm.hospitalName.classList.remove("error")
            errorHospitalName.classList.remove("active")
        }, delay)
    } else if (!prescriptionForm.prescriptionDate.value) {
        prescriptionForm.prescriptionDate.classList.add("error")
        errorDate.innerText = "Select a date"
        errorDate.classList.add("active")
        setTimeout(() => {
            prescriptionForm.prescriptionDate.classList.remove("error")
            errorDate.classList.remove("active")
        }, delay)
    }
    else if (!prescriptionForm.imgLink.value) {
        prescriptionForm.imgLink.classList.add("error")
        errorImg.innerText = "Enter a URL"
        errorImg.classList.add("active")
        setTimeout(() => {
            prescriptionForm.imgLink.classList.remove("error")
            errorImg.classList.remove("active")
        }, delay)
    }
    else if (!validateUrl(prescriptionForm.imgLink.value)) {
        prescriptionForm.imgLink.classList.add("error")
        errorImg.innerText = "Enter a valid URL"
        errorImg.classList.add("active")
        setTimeout(() => {
            prescriptionForm.imgLink.classList.remove("error")
            errorImg.classList.remove("active")
        }, delay)
    }
    else {
        const newPresData = {
            doctorName: prescriptionForm.docName.value.toCapitaliseWord(),
            hospitalName: prescriptionForm.hospitalName.value.toCapitaliseWord(),
            prescriptionDate: prescriptionForm.prescriptionDate.value,
            prescriptionImg: prescriptionForm.imgLink.value
        }
        const db = indexedDB.open("crude", 1)
        db.onsuccess = () => {
            const tx = db.result.transaction("users", "readwrite")
            const store = tx.objectStore("users")
            let cursor = store.get(currentUser.email)
            cursor.onsuccess = () => {
                let curUser = cursor.result
                console.log(curUser)
                if (!curUser.prescriptions) {
                    curUser.prescriptions = [newPresData]
                }
                else {
                    curUser.prescriptions.push(newPresData)
                }
                store.put(curUser)
                location.reload()
            }
            cursor.onerror = (e) => {
                console.log(e)
            }
        }
        console.log(newPresData)
    }
})

// for showing of prescriptions in the table
const presctionTableData = document.querySelector("#prescription-table .table-data")
let idb = indexedDB.open("crude", 1)
idb.onsuccess = () => {
    let res = idb.result
    let tx = res.transaction("users", "readonly")
    let store = tx.objectStore("users")
    let cursor = store.get(currentUser.email)
    cursor.onsuccess = () => {
        let userData = cursor.result
        userData.prescriptions.map((prescription, index) => {
            const row = document.createElement("tr")
            let tdata = document.createElement("td")
            tdata.innerHTML = index + 1
            row.appendChild(tdata)
            for (key in prescription) {
                let tdata = document.createElement("td")
                if (key === "prescriptionImg") {
                    console.log(key)
                    tdata.innerHTML = `<a href="${prescription[key]}"><button class="styled">Show</button></a>`
                    let td = document.createElement("td")
                    td.innerHTML = `<button class="delete-prescription styled" id="${index}">Delete</button>`
                    row.appendChild(tdata)
                    row.appendChild(td)
                    continue
                }
                tdata.innerText = prescription[key]
                row.appendChild(tdata)
            }
            presctionTableData.appendChild(row)
        })
    }
}

// for deleting prescription
const deleteBtns = document.querySelectorAll(".delete-prescription")
console.log(deleteBtns)
const cancelBtn = document.querySelector("#cancel-btn")
const confirmDelBtn = document.querySelector(".delete")
for (let btn in deleteBtns) {
    console.log(btn)
    // btn.addEventListener("click", () => {
    //     alert("hello")
    //     const confirmDelBox = document.querySelector(".pop-up-delete")
    //     confirmDelBox.classList.add("active")
    //     confirmDelBtn.addEventListener("click", () => {
    //         let idb = indexedDB.open("crude", 1)
    //         idb.onsuccess = () => {
    //             let tx = idb.result.transaction("users", "readwrite")
    //             let store = tx.objectStore("users")
    //             let cursor = store.delete(currentUser.email)
    //             cursor.onsuccess = () => {
    //                 sessionStorage.removeItem("currentUser")
    //                 location.assign("http://127.0.0.1:5500/")
    //             }
    //         }
    //     })
    //     cancelBtn.addEventListener("click", () => {
    //         confirmDelBox.classList.remove("active")
    //     })
    // })
};

// for logging out temporary
const logoutBtn = document.querySelector(".logout")
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("currentUser")
    location.assign("http://127.0.0.1:5500/")
})
