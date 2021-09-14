// $('.button').click(() => {
//     loginAccount();
// });

// $('.button_register').click(() => {
//     registerAccount();
// });


function loginAccount() {
    let login = document.getElementById('login_user').value;
    let pass = document.getElementById('login_password_input').value;
    alt.emit('requestPlayerLogin', login, pass);
}

function registerAccount() {
    let login = document.getElementById('user').value;
    let pass = document.getElementById('password_input').value;
    let pass2 = document.getElementById('password_input_2').value
    let email = document.getElementById('email').value;

    // if (login === "" || pass === "" || pass2 === "" || email === "") {
    //     nieWypelnionoAlert()
    // }

    if (pass === pass2 && login !== "" && email !== "") {
        alt.emit('createPlayerAccount', pass, login, email);
    } else {
        if (pass !== pass2) {
            zleHasloAlert();
        } else {
            nieWypelnionoAlert();
        }
    }    
}

// $("#alert").hide();

// JQuery .class #id

function zleHasloAlert() {
    new Noty({
        theme: "mint",
        type: 'error',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: 'Podane hasła się nie zgadzają',
        progressBar: true,
        timeout: 3000,
    }).show();

    // $(".content").append("<p>Wprowadzone hasła nie zgadzają się. Spróbuj ponownie.</p>");
    // $(".alert").show("closed");
}

function nieWypelnionoAlert() {
    new Noty({
        theme: "mint",
        type: 'error',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: 'Nie wypełniono wszystkich pól',
        progressBar: true,
        timeout: 3000,
    }).show();
}

function loginNiedostepnyAlert() {
    new Noty({
        theme: "mint",
        type: 'error',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: 'Wybrany login jest niedostępny, prosimy o wybranie innego',
        progressBar: true,
        timeout: 3000,
    }).show();
}

function loginError() {
    new Noty({
        theme: "mint",
        type: 'error',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: 'Login lub hasło niepoprawne',
        progressBar: true,
        timeout: 3000,
    }).show();
}

// $("#confirm").on("click", function() {
//     $(".alert").fadeOut();
// });

function nieznany_blad() {
    new Noty({
        theme: "mint",
        type: 'error',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: 'Wystąpił nieoczekiwany błąd. Szczerze mówiąc, może to byc wiele rzeczy, a mi nie chciało się definować każdego błędu. Wstaw to z opisem sytuacji na discord, a technik może coś zaradzi.',
        progressBar: true,
        timeout: 3000,
    }).show();
}

function zarejestrowanoAlert() {
    new Noty({
        theme: "mint",
        type: 'success',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: 'Zarejestrowaliśmy Twoje konto! Możesz teraz się zalogować',
        progressBar: true,
        timeout: 3000,
    }).show();
}

if ("alt" in window) {
    alt.on("nieznany_blad", () => {
        nieznany_blad();
    });

    alt.on("loginNiedostepnyAlert", () => {
        loginNiedostepnyAlert();
    });

    alt.on("loginError", () => {
        loginError();
    });

    alt.on("zarejestrowano", () => {
        zarejestrowanoAlert();
    });
}