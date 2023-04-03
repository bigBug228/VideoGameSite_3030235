console.log("Hello world");
const formElement = document.getElementById('addPost'); 
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('post').value;
  const link = document.getElementById('link').value;
  console.log(link);
  
  fetch("http://localhost:3000/api/posts",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('jwt') 
    },
    method: "POST",
    body: JSON.stringify({
     link:link,
     text:text
    })
})
.then(function(res){ console.log(res) })
.catch(function(res){ console.log(res) })
});
