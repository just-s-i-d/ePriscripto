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
for (let btn in deleteBtns){
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

