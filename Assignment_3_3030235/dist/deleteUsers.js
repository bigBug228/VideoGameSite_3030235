let initialData;
fetch("http://localhost:3000/api/users",
{
headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
})
.then((res) => {
    if (!res.ok) {
        return Promise.reject(`Error: ${res.status}`);
    }
     return res.json();
})

.then((data) => {
    initialData = data;
    console.log(initialData);
    const container = document.querySelector('.container');
    const template = document.querySelector('.template');
    initialData.forEach(user => {
      const clone = template.content.cloneNode(true);
      const userContent = clone.querySelector('.user');
      const userName = clone.querySelector('.userName');
      const userEmail = clone.querySelector('.userEmail');
      const userAdmin = clone.querySelector('.userAdmin');
      userContent.textContent= user.name +" "+user.email+" "+user.isAdmin;
      const deleteUserButton = clone.querySelector('.deleteUser');
      const editUserButton = clone.querySelector('.editUser');
      userName.value = user.name;
      userEmail.value = user.email;
      userAdmin.value = user.isAdmin;
      deleteUserButton.id= user._id;
      editUserButton.id = user._id;
      console.log(user._id)
    //   commentsContainer.id = post._id+"1";

    //   post.comments.forEach(comment=>{
    //     const item =document.createElement('p');
    //     item.innerHTML = comment.name +"<br>"+comment.text;
    //     commentsContainer.appendChild(item);
    //     // const commentContent =clone.querySelector('.comment');
    //     // commentContent.textContent = comment.text;
    //   });
      deleteUserButton.addEventListener('click',deleteUser);
      editUserButton.addEventListener('click',editUser);
      // console.log(post._id)
      // commentButton.setAttribute('id',post._id);
      //   const postImage = clone.querySelector('img');
      //   postImage.src = post.imageSrc;
      // Append the cloned elements to the container
      container.appendChild(clone);
    });
    
  })
  .catch((error) => {
    console.error(error);
  });
  function deleteUser(evt){
    let userId = evt.target.id;
    fetch(`http://localhost:3000/api/users/${userId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "DELETE"
})
.then((res) => {
  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }
  return res.json();
})
.then((data) => {
  console.log(data);
  window.location.reload(true);
})
.catch((err) => {
  console.error(err);
});
  }
  function editUser(evt) {
    let userId = evt.target.id;
    console.log(userId);
    const adminText = evt.target.previousElementSibling.value.toLowerCase();
    console.log(adminText);
    const emailText = evt.target.previousElementSibling.previousElementSibling.value;
    console.log(emailText);
    const nameText = evt.target.previousElementSibling.previousElementSibling.previousElementSibling.value;
    console.log(nameText);
    let isAdmin = false;
    if (adminText === "true") {
    isAdmin = true;
    } else if (adminText !== "false") {
    isAdmin = false;
    }
    fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name: nameText,
        email: emailText,
        isAdmin: isAdmin
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }