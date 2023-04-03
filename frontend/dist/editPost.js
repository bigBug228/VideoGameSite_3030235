console.log("editPost PAGE");
let initialData;
fetch("http://localhost:3000/api/getPosts",
{
headers: {
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
    initialData.forEach(post => {
      const clone = template.content.cloneNode(true);
      const postContent = clone.querySelector('.post');
      postContent.textContent = post.text;
      const editPostButton = clone.querySelector('.editPost');
      const deletePostButton = clone.querySelector('.deletePost')
      const commentsContainer = clone.querySelector('.commentsContainer');

      const postImage = clone.querySelector('.image');
      console.log(postImage);
      postImage.value = post.link;
      editPostButton.id = post._id;
      deletePostButton.id = post._id;
      commentsContainer.id = post._id+"1";

      post.comments.forEach(comment=>{
        const commentButtons = document.createElement('button');
        commentButtons.textContent = "delete";
        const editCommentsButtons = document.createElement('button');
        editCommentsButtons.textContent = "edit";
        commentButtons.id = comment._id;
        editCommentsButtons.id = comment._id;
        console.log(commentButtons);
        commentButtons.addEventListener('click', () => {
            deleteComment(comment._id, post._id);
          });
        editCommentsButtons.addEventListener('click', (evt) => {
            editComment(comment.name,comment._id, post._id, evt);
          }); 
        const item =document.createElement('textarea');
        item.textContent = comment.text;
        commentsContainer.appendChild(item);
        commentsContainer.appendChild(editCommentsButtons);
        commentsContainer.appendChild(commentButtons);
      });
      editPostButton.addEventListener('click',editPost);
      deletePostButton.addEventListener('click',deletePost);

      container.appendChild(clone);
    });
  })
  .catch((error) => {
    console.error(error);
  });

  function editPost(evt) {
    let postId = evt.target.id;
    let commentsContainer = document.getElementById(postId+"1");
    console.log(commentsContainer);
    const postText = evt.target.previousElementSibling.value;
    const postArea =evt.target.previousElementSibling;
    const linkText = evt.target.previousElementSibling.previousElementSibling.value;
    console.log(linkText);
    const linkArea = evt.target.previousElementSibling.previousElementSibling;
    console.log("http://localhost:3000/api/posts/" + postId);
    fetch(`http://localhost:3000/api/posts/${postId}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        link: linkText,
        text: postText
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
  function deleteComment(commentId,postId){
    console.log(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`);
    fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "DELETE",
  body: JSON.stringify({
    _id:commentId
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
  function deletePost(evt){
    let postId = evt.target.id;
    fetch(`http://localhost:3000/api/posts/${postId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "DELETE"
})

  }
  function editComment(name,commentId, postId,evt){
    const commentText = evt.target.previousElementSibling.value;
    console.log(commentText)
    fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
  headers: {
    'Authorization': localStorage.getItem('jwt'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "PATCH",
  body: JSON.stringify({
    text:commentText,
    _id: commentId,
    name: name

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
  