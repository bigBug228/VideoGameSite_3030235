console.log("Login form");
const formElement = document.getElementById('loginForm'); 
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const User = {
    email: email,
    password: password
  }
  fetch("http://localhost:3000/api/signin",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      email:User.email,
      password:User.password
    })
})
.then((res) => {
    if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
    }
     return res.json();
})
.then((data) => {
    if (data.token) {
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('admin',data.isAdmin);
        localStorage.setItem('name',data.name);
        window.location.href = 'index.html';
    }
})
});

