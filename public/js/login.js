const form = document.querySelector('.form');
const error = document.querySelector('.error');

//Add a submit event listener
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //Get input values
    const email = form.email.value;
    const password = form.password.value;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type' : 'application/json' }
        });
        const data = await res.json();
        displayError(data);
    }
    catch(err) {
        console.log(err);
    }

});

function displayError(err) {
    if (err.includes('Login Success')) {
        error.classList.add('success-display');
        error.innerHTML = err; 
        setTimeout(() => {
            //This will redirect user after 3 sec to homepage. Only if login was success!
            window.location.replace('/');
        }, 2800);
    } else {
        error.classList.add('active-error');
        error.innerHTML = err;
    }
    setTimeout(() => {
        disableError();
    }, 2500);
}

function disableError() {
    error.classList.remove('active-error');
    error.classList.remove('success-display');
    error.innerHTML = '';
}