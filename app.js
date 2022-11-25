const passBox = document.getElementById("pass-box")
const passInput = document.getElementById('pass')
const loginInput = document.getElementById('login')
let password = ''

function generatePasswordBox() {
    passBox.innerHTML = ""
    for (let i = 0; i < 16; i++) {
        let passItem = document.createElement("div");
        passItem.classList.add("pass-item")
        passBox.append(passItem)
    }
}

function addNumbersToPasswordBox() {
    const passItems = Array.from(document.querySelectorAll('.pass-item'))
    let itemWithNumbers = passItems.sort(() => 0.5 - Math.random()).slice(0, 10)
    itemWithNumbers.map((passItem, index) => {
        passItem.textContent = index;
        passItem.setAttribute("value", index)
        passItem.classList.add("number")
    })
}

function checkValidity(n) {
    n = Number.isInteger(n) ? n : parseInt(n)
    return Number.isInteger(n) && n >= 0 && n <= 9
}

function setPassword(n) {
    if (!checkValidity(n)) return
    password += n
    passInput.value = password
}

function resetPassword() {
    generatePasswordBox()
    addNumbersToPasswordBox()
    password = ""
    passInput.value = password
}

async function fetchData(url, formData) {
    const response = await fetch(url, {
        body: formData,
        method: "post"
    });

    if (!response.ok) {
        throw new Error(`Erreur : ${response.status}`);
    }

    const data = await response.json()
    return data
}

async function tryLogin() {

    if(loginInput.value == '') {
        loginInput.style.boxShadow = '0px 0px 3px 1px red'
    }

    let formData = new FormData();
    formData.append('login', loginInput.value);
    formData.append('password', password);

    try{
        response = await fetchData('https://www.ericfreelance.fr/api/check_user.php', formData)
        document.getElementById('message').textContent = response.message
        document.getElementById('message').classList.remove('hidden')
        if(!response.check) resetPassword()
    } catch(e) {
        console.log(e)
        throw new Error(`Erreur : ${response.status}`);
    }
}

resetPassword()
passBox.addEventListener("click", (e) => {
    if (e.target.getAttribute('value')) setPassword(e.target.getAttribute('value'))
})
loginInput.addEventListener('change', () => {
    if(loginInput.value != '') loginInput.style.boxShadow = ''
})
document.getElementById('reset').addEventListener('click', resetPassword)
document.getElementById('send').addEventListener('click', tryLogin)