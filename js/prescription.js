
let requestPending
//for showing error for form fields

// for sorting array on the basis of date
function sortPrescriptions(prescriptions) {
    return prescriptions.sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate))
}
// for prescription box
const prescriptionShowBtn = document.querySelector("#show-prescription-box")
const prescriptionBox = document.querySelector(".prescription-section")
const prescriptionCard = document.querySelector(".prescription-card")
const cancelPrescription = document.querySelector("#cancel-prescription-btn")

function closePrescriptionBox(event) {
    event.preventDefault()
    prescriptionBox.classList.remove("active")
}

function openPrescriptionBox() {
    prescriptionBox.classList.toggle("active")
    prescriptionBox.onclick = (event) => {
        if (event.target === prescriptionBox)
            closePrescriptionBox(event)
    }
}
cancelPrescription.onclick = function (event) {
    closePrescriptionBox(event)
}

prescriptionShowBtn.onclick = openPrescriptionBox


// for checking if user is logged in or not
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"))

if (!currentUser) {
    location.assign("http://127.0.0.1:5500/")
}
// for fetching user details
const url = "http://localhost:3000/users"
async function getUserDetails(userId) {
    try {
        const response = await fetch(`${url}/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            method: "GET",
        })
        if (!response.ok) {
            console.log("cannot get user details")
        } else {
            const details = await response.json()
            return details
        }
    }
    catch {
        console.log("there was an error contacting the server")
    }
}

// for updating prescription details
async function updatePrescriptions(userId, prescriptions) {
    try {
        const response = await fetch(`${url}/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            method: "PATCH",
            body: JSON.stringify({ prescriptions })
        })
        return response
    } catch {
        toast("Server error", "error")
    }
}
// for showing of prescriptions in the table
const presctionTableData = document.querySelector("#prescription-table .table-data")
const emptyTable = document.querySelector(".empty-table")
function showPrescriptions() {
    let idb = indexedDB.open("crude", 1)
    idb.onsuccess = () => {
        let res = idb.result
        let tx = res.transaction("users", "readonly")
        let store = tx.objectStore("users")
        let cursor = store.get(currentUser.email)
        cursor.onsuccess = () => {
            let curUser = cursor.result
            fetch(`${url}/${curUser.id}`, {
                headers: {
                    "Accept": "application/json"
                },
                method: "GET",
            }).then(Response => Response.json())
                .then(data => {
                    const { prescriptions } = data
                    if (prescriptions) {
                        if (prescriptions.length) {
                            prescriptions.map((prescription, index) => {
                                const row = document.createElement("tr")
                                let tdata = document.createElement("td")
                                tdata.innerHTML = index + 1
                                row.appendChild(tdata)
                                for (let key in prescription) {
                                    let tdata = document.createElement("td")
                                    if (key === "prescriptionImg") {
                                        tdata.innerHTML = `<a href="${prescription[key]}" onclick="newWindow(event,this.href)"><button class="styled">Show</button></a>`
                                        let td = document.createElement("td")
                                        td.innerHTML = `<img class="edit-prescription action-btn" src="/images/edit.png" onclick="editPrescription(this.id)" id="${index}"/>
                                        <img class="delete-prescription action-btn" src="/images/delete.png" onclick="deletePrescription(this.id)" id="${index}"/> `
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
                        else {
                            emptyTable.classList.add("active")
                        }
                    }
                    else {
                        emptyTable.classList.add("active")
                    }
                }).catch(() => {
                    toast("Cannot get your prescriptions", "error")
                    emptyTable.classList.add("active")
                })
        }
        cursor.onerror = () => {
            toast("Cannot get your prescriptions", "error", "reload")
        }
    }
    idb.onerror = () => {
        toast("Cannot get your prescriptions", "error", "reload")
    }
}
window.onload = showPrescriptions
// for name pattern matching 
function validateDocName(name) {
    return /^(Dr\.?|Doctor)?\s?[A-Za-z\s\.'-]+$/.test(name)
}
function validateHospitalName(name) {
    return /^[A-Za-z\s\.'-]+$/.test(name)
}
function validateUrl(url) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url)
}
// for add new prescription
const closePopUp = document.querySelector("#close-toast")
const errorName = document.querySelector(".form-field .error-name")
const errorHospitalName = document.querySelector(".form-field .error-hospital-name")
const errorDate = document.querySelector(".form-field .error-date")
const errorImg = document.querySelector(".form-field .error-img")
const prescriptionForm = document.querySelector("#prescription-form")
const errorAlias = document.querySelector(".form-field .error-alias")
let currentDate = new Date()
function handlePrescriptionFormSubmit(event, btnId) {
    event.preventDefault()
    const { alias, docName, hospitalName, prescriptionDate, imgLink } = prescriptionForm
    const selectedDate = new Date(prescriptionForm.prescriptionDate.value)
    const aliasValue = alias.value.trim()
    const docNameValue = docName.value.trim()
    const hospitalNameValue = hospitalName.value.trim()
    if (!prescriptionForm.alias.value.trim()) {
        inputError(prescriptionForm.alias, errorAlias, "Enter prescription name",)
    }
    else if (!prescriptionForm.docName.value.trim()) {
        inputError(prescriptionForm.docName, errorName, "Enter doctor name",)
    }
    else if (!validateDocName(prescriptionForm.docName.value.trim())) {
        inputError(prescriptionForm.docName, errorName, "Special characters not allowed")
    }
    else if (!prescriptionForm.hospitalName.value.trim()) {
        inputError(prescriptionForm.hospitalName, errorHospitalName, "Enter hospital name")
    }
    else if (!validateHospitalName(prescriptionForm.hospitalName.value)) {
        inputError(prescriptionForm.hospitalName, errorHospitalName, "Special characters except(' , .) not allowed")
    } else if (!prescriptionForm.prescriptionDate.value) {
        inputError(prescriptionForm.prescriptionDate, errorDate, "Select a date")
    }
    else if (selectedDate > currentDate) {
        inputError(prescriptionForm.prescriptionDate, errorDate, "Date cannot be in future")
    }
    else if (!prescriptionForm.imgLink.value.trim()) {
        inputError(prescriptionForm.imgLink, errorImg, "Enter a URL")
    }
    else if (!validateUrl(prescriptionForm.imgLink.value)) {
        inputError(prescriptionForm.imgLink, errorImg, "Enter a valid URL")
    }
    else {
        const newPresData = {
            alias: prescriptionForm.alias.value.trim(),
            doctorName: prescriptionForm.docName.value.trim(),
            hospitalName: prescriptionForm.hospitalName.value.trim(),
            prescriptionDate: prescriptionForm.prescriptionDate.value,
            prescriptionImg: prescriptionForm.imgLink.value.trim()
        }
        const db = indexedDB.open("crude", 1)
        db.onsuccess = () => {
            const tx = db.result.transaction("users", "readonly")
            const store = tx.objectStore("users")
            let cursor = store.get(currentUser.email)
            cursor.onsuccess = () => {
                let curUser = cursor.result
                fetch(`${url}/${curUser.id}`, {
                    headers: {
                        "Accept": "application/json"
                    },
                    method: "GET",
                }).then(Response => Response.json())
                    .then(data => {
                        if (!data.prescriptions) {
                            data.prescriptions = [newPresData]
                        }
                        else if (btnId) {
                            data.prescriptions[btnId] = newPresData
                        }
                        else {
                            data.prescriptions.push(newPresData)
                        }
                        const sortedPrescriptions = sortPrescriptions(data.prescriptions)
                        updatePrescriptions(curUser.id, sortedPrescriptions)
                            .then(response => {
                                if (response.ok) {
                                    prescriptionForm.reset()
                                    closePrescriptionBox(event)
                                    if (btnId) {
                                        toast("Prescription updated", "success", "reload")
                                    }
                                    else {
                                        toast("Prescription Added", "success", "reload")
                                    }
                                }
                            }).catch(() => {
                                closePrescriptionBox(event)
                                toast("Prescription cannot be added", "error")
                            })
                    }).catch(() => {
                        prescriptionForm.reset()
                        closePrescriptionBox(event)
                        toast("No response from server", "error")
                    })
            }
            cursor.onerror = (e) => {
                closePrescriptionBox(event)
                toast("Server error", "error", "reload")
            }
        }
    }
}
prescriptionForm.onsubmit = function (event) {
    handlePrescriptionFormSubmit(event)
}


// 
function newWindow(event, imgUrl) {
    event.preventDefault()
    window.open(imgUrl)
}
// for deleting prescription
const deleteBtns = document.querySelectorAll(".delete-prescription")
const cancelBtn = document.querySelector("#cancel-btn")
const confirmDelBtn = document.querySelector(".delete")

function deletePrescription(btnId) {
    const confirmDelBox = document.querySelector(".pop-up-delete")
    confirmDelBox.classList.add("active")
    confirmDelBtn.onclick = () => {
        let idb = indexedDB.open("crude", 1)
        idb.onsuccess = () => {
            let tx = idb.result.transaction("users", "readonly")
            let store = tx.objectStore("users")
            let cursor = store.get(currentUser.email)
            cursor.onsuccess = () => {
                let curRes = cursor.result
                getUserDetails(curRes.id)
                    .then(userData => {
                        const { prescriptions } = userData
                        prescriptions.splice(btnId, 1)
                        updatePrescriptions(curRes.id, prescriptions)
                            .then(response => response.json())
                            .then(data => {
                                confirmDelBox.classList.remove("active")
                                toast("Prescription deleted", "success", "reload")
                            })
                    })
            }
        }
    }
    cancelBtn.onclick = () => {
        confirmDelBox.classList.remove("active")
    }
}

// for editing priscription
const savePrescriptionBtn = document.querySelector("#save-prescription-btn")
const addrescriptionBtn = document.querySelector("#add-new-prescription")
function editPrescription(btnId) {
    savePrescriptionBtn.classList.add("active")
    addrescriptionBtn.classList.add("not-active")
    getUserDetails(currentUser.id)
        .then((data) => {
            try {
                const prescription = data.prescriptions[btnId]
                const { alias, doctorName, hospitalName, prescriptionDate, prescriptionImg } = prescription
                openPrescriptionBox()
                prescriptionForm.alias.value = alias
                prescriptionForm.docName.value = doctorName
                prescriptionForm.hospitalName.value = hospitalName
                prescriptionForm.prescriptionDate.value = prescriptionDate
                prescriptionForm.imgLink.value = prescriptionImg
                savePrescriptionBtn.onclick = function (event) {
                    handlePrescriptionFormSubmit(event, btnId)
                }
            } catch (error) {
                console.log(error)
                toast("Cannot edit prescription", "error")
            }
        }).catch(() => {
            toast("Server error", "error")
        })
}






