// document.querySelector('#getInfo').addEventListener('click', function(e){
//   e.preventDefault();
//   fetchComments(e);
// })

// function fetchComments(event) {
//   fetch('https://us-central1-fir-cb-backend.cloudfunctions.net/api/comment/')
//   .then(res => res.json())
//   .then(data => creatingComments(data));
//   // setTimeout(fetchComments, 1000);
// };

// function creatingComments(data){
//   var divComments = document.querySelector('.comments');
//   divComments.innerHTML = '';
//   for (var i = 0; i < data.length; i++) {
//     var divHolder = document.createElement('div');
//     var list = document.createElement('ul');
//
//     var listAuthor = document.createElement('li');
//     listAuthor.innerText = data[i].author;
//     listAuthor.dataset.author = data[i].author;
//     list.append(listAuthor);
//
//     var listComment = document.createElement('li');
//     listComment.innerText = data[i].comment;
//     listComment.dataset.comment = data[i].comment;
//     list.append(listComment);
//
//     divHolder.append(list);
//     divHolder.addClassName = "smallComments";
//
//     var deleteBtn = document.createElement('button');
//     deleteBtn.innerText = 'Delete this comment?';
//     deleteBtn.dataset._id = data[i]._id;
//     deleteBtn.addEventListener('click', function(e){
//       e.preventDefault();
//       deleteData(e.target.dataset._id);
//     })
//     divHolder.append(deleteBtn);
//
//     divComments.append(divHolder);
//   }
// }


// document.querySelector('form').addEventListener('submit', function(e){
//   e.preventDefault();
//   var myObj = {}
//   for (var i = 0; i < e.target.length-1; i++) {
//     console.log(typeof e.target[i].name);
//     if(e.target[i].name == false || e.target[i].value == false){
//       alert('Name and comment must include something');
//     } else {
//       myObj[e.target[i].name] = e.target[i].value;
//     }
//   }
//   console.log(myObj);
//   postData(`https://us-central1-fir-cb-backend.cloudfunctions.net/api/comment/`, myObj);
// })


function postData(url = `http://localhost:3001/comment/`, data = {}) {
  console.log('help');
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(function(response){
      response.json();
      // fetchComments();
      // document.querySelector('form').reset();
    })
    .catch(function (error) {
      return;
    });
}


function deleteData(item) {
  return fetch(`http://localhost:3001/comment/${item}`, {
    method: 'DELETE'
  })
  .then(function(response){
    console.log(response);
    // fetchComments();
  })
  .catch(function (error) {
    return;
  });
}


function editData(id, data) {
  return fetch(`http://localhost:3001/comment/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(function(response){
    console.log(response);
    getCommentsFromAPI();
    modal.style.display = "none";
  })
  .catch(function (error){
    return error;
  })
};


function addMany(data) {
  console.log(data);
  return fetch(`http://localhost:3001/comment/addMany`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
        "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(function(response) {
    console.log(response);
    // getCommentsFromAPI();
  })
  .catch(function (error){
    return error;
  })
}

function pagination(page, numOfResults){
  return fetch(`http://localhost:3001/comment/${page}/${numOfResults}`)
  .then(function(response) {
    console.log(response);
    // getCommentsFromAPI();
  })
  .catch(function (error){
    return error;
  });
}
