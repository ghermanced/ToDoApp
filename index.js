const body = $("body")
const loginInput = $("#login")
const passInput = $("#pass")
const repeatPassInput = $("#repeat-pass-input")
const loginBtn = $("#loginBtn")
const joinBtn = $("#joinBtn")
const registerBtn = $("#registerBtn")
const repeatPassWrapper = $("#repeat-pass")

var data
var objectData = []
var logging = true
var users = []
const parser = new DOMParser()


class Task {
    constructor(title, priority, isCompleted=false) {
        this.title = title
        this.priority = priority
        this.isCompleted = isCompleted
        this.creationData = new Date().toDateString()
    }

    deleteTask() {

    }

    completeTask() {
        this.isCompleted = !this.isCompleted
    }

    editTask(title, priority) {
        this.title = title
        this.priority = priority
    }

    getCreationData() {
        return this.creationData
    }

}


function hide() {
    if (!logging) {
        joinBtn.show()
        registerBtn.hide()
        repeatPassWrapper.hide()
    } else {
        joinBtn.hide()
        registerBtn.show()
        repeatPassWrapper.show()
    }
    logging = !logging
}


async function loginUser() {
    if (!logging) {
        hide(logging)
    } else {
        let username = loginInput.val()
        if (users.includes(username)) {
            let hashedPass = await hashPass(passInput.val()).then((val) => val)


            for (let i = 0; i < objectData.length; i++) {
                let currentUser = objectData[i]["username"]
                let currentPass = objectData[i]["password"]

                if (currentUser == username) {
                    if (currentPass == hashedPass) {
                        console.log("Logged In")
                        let startString = `
                            <div id="user-info-wrapper">
                                <div>Username: ${username}</div>
                                <div>Hashed Password: ${hashedPass}</div>
                            </div>`

                        
                        var addButton = $("<button>Add Task</button>")

                        addButton.on("click", () => {
                            console.log("hwre")
                        })

                        let addField = `
                            <div id="add-task-wrapper">
                                <p>Title</p>
                                <input class="input-add" id="input-title" type="text">
                                <p>Priority</p>
                                <select class="input-add" id="input-priority">
                                    <option selected>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                                <p>Completed</p>
                                <input class="input-add" id="input-completed" type="checkbox">
                                <p>Order</p>
                                <input class="input-add" id="input-order" type="text">
                            </div>
                        `

                        let tasksLine =  `
                            <div>Tasks:</div>
                            <div>------------------</div>
                        `
                        let finalString = ``
                        for (let taskIndex = 0; taskIndex < objectData[i]["notes"].length; taskIndex++) {
                            let currentTask = objectData[i]["notes"][taskIndex]
                            let currentTitle = currentTask["title"]
                            let currentPriority = currentTask["priority"]
                            let currentOrder = currentTask["order"]
                            let taskIsCompleted = currentTask["completed"]

                            finalString = finalString + `
                                <div class="task-div-${taskIndex}" class="task-div"">
                                    <div>Title: ${currentTitle}</div>
                                    <div>Priority: ${currentPriority}</div>
                                    <div>Order: ${currentOrder}</div>
                                    <div>Creation Data: ${new Date().toDateString()}</div>
                                    <div>Completed 
                                        <input type="checkbox" id="checkbox-${taskIndex}" class="task-checkbox" ${taskIsCompleted ? 'checked' : ''}/></div>
                                    <div>----------------</div>
                                </div>
                            `
                        }

                        $(".app-wrapper").css("display", "none")
                        $(body).prepend(finalString)
                        $(body).prepend(tasksLine)
                        $(body).prepend(addButton)
                        $(body).prepend(addField)
                        $(".input-add").css("margin-bottom", "10px")
                        $(body).prepend(startString)
                    
                    } else {
                        console.log("Incorrect Password")
                    }
                }
            }

        } else {
            console.log("There is no such username")
        }
    }
}

function joinUser() {
    hide(logging)
}

async function hashPass(pass) {
    const passUint8 = new TextEncoder().encode(pass)
    const hashBuffer = await crypto.subtle.digest("SHA-1", passUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    
    return hashHex
}

function checkHashes(hash1, hash2) {
    return hash1 == hash2
}


async function registerUser() {
    var hash1
    var hash2
    if (!(loginInput.val() in users)) {
        hash1 = await hashPass(passInput.val()).then((val) => val)
        hash2 = await hashPass(repeatPassInput.val()).then((val) => val)
        
        if (checkHashes(hash1, hash2)) {
            objectData.push({
                "username": loginInput.val(),
                "password": hash1,
            })

            // let newVal = `
            //     <user>
            //         <username>${loginInput.val()}</username>
            //         <password>${hash1}</password>
            //     </user>`
            // $(data).find("users").append(newVal)
            
            // let newData = parser.transformToDocument(data)
            // newData = new XMLSerializer().serializeToString(newData)
            // console.log(newData)

            console.log("Succesfull")
        
        } else {
            console.log("Passwords are different")
        }

    } else {
        console.log("Username is used, create another one")
    }
}


$(document).ready(async () => {
    
    data = await fetch("./users_todo.xml")
    .then(response => response.text())
    .then(data => {
        const xmlDoc = parser.parseFromString(data, "application/xml")
        return xmlDoc
    })
    
    let allUsers = $(data).find("user")
    for (let i = 0; i < allUsers.length; i++) {
        let currentUsername = $(allUsers[i]).find("username")[0].textContent
        let currentPass = $(allUsers[i]).find("password")[0].textContent
        let notes = $($(allUsers[i]).find("todos")).find("note")
        let notesArr = []

        for (let j = 0; j < notes.length; j++) {

            let currentTitle = $(notes[j]).find("title")[0].textContent
            let currentPriority = $(notes[j]).find("priority")[0].textContent
            let currentOrder = $(notes[j]).find("order")[0].textContent
            let currentCompleted = $(notes[j]).find("completed")[0].textContent
    
            notesArr.push({
                "title": currentTitle,
                "priority": currentPriority,
                "order": currentOrder,
                "completed": currentCompleted == "true" ? true : false
            })
        }

        objectData.push({
            "username": currentUsername,
            "password": currentPass,
            "notes": notesArr,
        })
    }

    for (let [_, object] of Object.entries(objectData)) {
        for (let [key, value] of Object.entries(object)) {
            if (key == "username") {
                users.push(value)
            }
        }
    }
})
    
