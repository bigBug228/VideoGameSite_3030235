console.log("Hello world");
const formElement = document.getElementById('form1'); 
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;;
  const newUser = {
    name: name,
    email: email,
    password: password
  }
  console.log(JSON.stringify(newUser));
  fetch("http://localhost:3000/api/signup",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      name:newUser.name,
      email:newUser.email,
      password:newUser.password
    })
})
.then(function(res){ 
  console.log(res) 
  window.location.href = 'login.html';
})
.catch(function(res){ console.log(res) })
});
