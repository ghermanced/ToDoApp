const body = $("body")
const loginInput = $("#login")
const passInput = $("#pass")
const repeatPassInput = $("#repeat-pass-input")
const loginBtn = $("#loginBtn")
const joinBtn = $("#joinBtn")
const registerBtn = $("#registerBtn")
const repeatPassWrapper = $("#repeat-pass")

const dataBase = {}
var logging = true

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

function loginUser() {
    if (!logging) {
        hide(logging)
    } else {
        console.log(loginInput.val())
        console.log(passInput.val())
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
    if (!(loginInput.val() in dataBase)) {
        var hash1 = await hashPass(passInput.val()).then((val) => val)
        var hash2 = await hashPass(repeatPassInput.val()).then((val) => val)
        
        if (checkHashes(hash1, hash2)) {
            dataBase[loginInput.val()] = hash1
            console.log(dataBase)
        } else {
            console.log("Passwords are different")
        }

    } else {
        console.log("Username is used, create another one")
    }
}