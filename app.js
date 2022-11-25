const passBox = document.getElementById("pass-box")
const passInput = document.getElementById('pass')
const loginInput = document.getElementById('login')

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

function resetPassword() {
    generatePasswordBox()
    addNumbersToPasswordBox()
    passInput.value = ""
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

    document.getElementById('message').textContent = ''

    if(loginInput.value == '') {
        loginInput.style.boxShadow = '0px 0px 3px 1px red'
    } else if(!loginInput.value.match(/[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/)) {
        document.getElementById('message').textContent += 'Vous devez saisir une adresse mail valide ! '
        document.getElementById('message').classList.remove('hidden')
    }

    let formData = new FormData();
    formData.append('login', loginInput.value);
    formData.append('password', passInput.value);

    try{
        response = await fetchData('https://www.ericfreelance.fr/api/check_user.php', formData)
        document.getElementById('message').textContent += response.message
        document.getElementById('message').classList.remove('hidden')
        if(!response.check) resetPassword()
    } catch(e) {
        throw new Error(`Erreur : ${e.message}`);
    }
}

resetPassword()
passBox.addEventListener("click", (e) => {
    if (e.target.getAttribute('value') && checkValidity(e.target.getAttribute('value'))) passInput.value += e.target.getAttribute('value')
})
loginInput.addEventListener('change', () => {
    if(loginInput.value != '') loginInput.style.boxShadow = ''
})
document.getElementById('reset').addEventListener('click', resetPassword)
document.getElementById('send').addEventListener('click', tryLogin)