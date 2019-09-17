// Registro do ServiceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw')
            .then((registration) => {
                // Quando registrar com sucesso
                console.log('Service Worker Registrado com sucesso. Escopo: ' + registration.scope)
            }, (err) => {
                // Quando falhar
                console.log('Erro ao registrar Service Worker: ' + err)
            })
    })
}

let host = 'https://coins-request.herokuapp.com'

if (location.hostname === "localhost")
    host = 'http://localhost:9090'

const request = `${host}/request`

window.onpopstate = (event) => {
    if (event.state !== null) {
        let url = event.state.url
        let route = `${host}${url}`
        axios.get(route).then((req, res) => {
            document.documentElement.innerHTML = req.data
            sendRequest('send_request', 'date')
        })
    } else {
        axios.get('/')
            .then((req, res) => {
                document.documentElement.innerHTML = req.data
                goRequest()
            })
    }
}

function sendForm(form, inputs = []) {
    if (form) {
        console.log('preventDefault nesse form: ' + form)
        document.getElementById(form).addEventListener('submit', event => {
            event.preventDefault()

        })
    }
}

function goRequest() {
    let btnRegister = document.getElementById('request_page')

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            axios.get(request)
                .then((req, res) => {
                    document.documentElement.innerHTML = req.data
                    const stateObj = { url: "/request" }
                    history.pushState(stateObj, "Request", "/request")
                    sendForm('request_form', ['date'])
                    sendRequest('send_request', 'date')
                    returnPage('return_page')
                })
        })
    }
} goRequest()

function goPage(element, page, url_history, name_history) {
    let isElement = document.getElementById(element)
    if (isElement) {
        isElement.addEventListener('click', function () {
            event.preventDefault()
            axios.get(page)
                .then((req, res) => {
                    document.documentElement.innerHTML = req.data
                    const stateObj = { url: url_history }
                    history.pushState(stateObj, name_history, url_history)
                    sendRequest('send_request', 'date')
                })
        })
    }
}

function returnPage(element) {
    let isElement = document.getElementById(element)
    if (isElement) {
        isElement.addEventListener('click', function () {
            history.go(-1)
        })
    }
}

returnPage('return_page')

function requestCripto(date, coin) {
    if (date) {
        const host = `https://www.mercadobitcoin.net/api/${coin}/day-summary/`
        let request = `${host}${date}`
        axios.get(request)
            .then((req, res) => {
                console.log(req)
                document.getElementById('response').classList.remove('hide')
                document.getElementById('coinSelected').innerHTML = coin
                document.getElementById('date2').innerHTML = req.data.date
                document.getElementById('opening').innerHTML = req.data.opening
                document.getElementById('closing').innerHTML = req.data.closing
                document.getElementById('lowest').innerHTML = req.data.lowest
                document.getElementById('highest').innerHTML = req.data.highest
                document.getElementById('volume').innerHTML = req.data.volume
                document.getElementById('quantity').innerHTML = req.data.quantity
                document.getElementById('amount').innerHTML = req.data.amount
                document.getElementById('avg_price').innerHTML = req.data.avg_price
            })
    }
}

function sendRequest(btn, date) {
    let date2 = document.getElementById(date)
    let isElement = document.getElementById(btn)
    let radios = document.getElementsByName('coin')
    let radioCheck
    if (isElement) {
        isElement.addEventListener('click', function (event) {
            event.preventDefault()
            radios.forEach(radio => {
                if (radio.checked) {
                    radioCheck = radio
                }
            })
            let dateFormat = date2.value.replace('-', '/').replace('-', '/')
            console.log('data: ' + dateFormat)
            if (dateFormat.length > 0) {
                if (radioCheck) {
                    requestCripto(dateFormat, radioCheck.id)
                } else {
                    alert('Selecione uma moeda')
                }
            } else {
                alert('Selecione uma data')
            }
        })
    }
}

document.onreadystatechange = function () {
    // dataBase()
    if (document.readyState === 'complete') {

        let current_url = window.location.href
        const request_regex = /\/request/g
        if (request_regex.test(current_url)) {
            //chama a função sendForm quando atualizar a página
            // sendForm('request_form', ['date'])
            console.log('chamou a função')
            sendRequest('send_request', 'date')
        }

    }

}