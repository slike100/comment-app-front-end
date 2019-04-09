//GLOBAL VARIABLES FOR COMPARISON
window.addEventListener('DOMContentLoaded', (event) => {
  connection.addEventListener('change', function(e){
    console.log(e);
    e.preventDefault();
    updateConnectionStatus(e);
  });
  if(connection.rtt === 50){
    getCommentsFromAPI();
    window.loading = setInterval(getCommentsFromAPI,1000000);
  } else if(connection.rtt === 0) {
    // playAround();
  }
});

var deletedIDS = [];
var addedComments = [];
var updatedComments = [];

window.loading;
window.isConnected;
window.connection = navigator.connection;

function updateConnectionStatus(e) {
  if(e.target.rtt === 50){
    getCommentsFromAPI();
    window.loading = setInterval(getCommentsFromAPI, 1000000);
    return isConnected = true;
  } else if(e.target.rtt === 0) {
    clearInterval(loading);
    return isConnected = false;
  }
}


async function getCommentsFromAPI(){
  if(addedComments){
     for (var i = 0; i < addedComments.length; i++) {
       await postData(`http://localhost:3001/comment/`, addedComments[i]);
     }
     addedComments.length = 0;
     console.log(addedComments);
   }
   if(deletedIDS){
     for (var i = 0; i < deletedIDS.length; i++) {
      await deleteData(deletedIDS[i]);
     }
     deletedIDS.length = 0;
   }
    var getComments = await fetch("http://localhost:3001/comment/")
      .then(req => req.json())
      .then(data => data);

    window.db = new Dexie("comment_database");
    db.version(1).stores({
        comments: '_id,author,comment,pubDate'
    });
    db.comments.clear();
    // Put some data into it
    db.comments.bulkPut(getComments).then(function () {
      console.log(getComments);
        // Then when data is stored, read from it
        var commentsArr = [];
        return db.comments.each(comment => {
          populateTableWithIndexDBData()
        });
    }).catch(function (error) {
          console.error(`Ooops: ${error}`);
    });
    console.log('IndexDB reload');
}



//POPULATE UI WITH IndexDB DATA
async function populateTableWithIndexDBData(){
  var divComments = document.querySelector('.comments');
  divComments.innerHTML = '';
  let comments = await db.comments.toArray();
  for (var i = 0; i < comments.length; i++) {
    var divHolder = document.createElement('div');
    var list = document.createElement('ul');

    var listAuthor = document.createElement('p');
    listAuthor.innerText = comments[i].author;
    listAuthor.dataset.author = comments[i].author;
    listAuthor.contentEditable = 'true';
    list.append(listAuthor);

    var listComment = document.createElement('li');
    listComment.innerText = comments[i].comment;
    listComment.dataset.comment = comments[i].comment;
    list.append(listComment);

    divHolder.append(list);
    divHolder.addClassName = "smallComments";

    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('dltBtn');
    deleteBtn.innerText = 'Delete this comment?';
    deleteBtn.dataset._id = comments[i]._id;
    deleteBtn.addEventListener('click', function(e){
      e.preventDefault();
      deleteComment(e);
    })

    var editButton = document.createElement('button');
    editButton.classList.add('editButton');
    editButton.innerText = 'Edit this comment?';
    editButton.dataset._id = comments[i]._id;
    editButton.dataset.name = comments[i].author;
    editButton.dataset.comment = comments[i].comment;
    editButton.addEventListener('click', function (e){
      modal.style.display = 'block';
      document.getElementById('editName').value = e.target.dataset.name;
      document.getElementById('editComments').value = e.target.dataset.comment;
      document.getElementById('editBtn').dataset._id = e.target.dataset._id;
    })

    // editButton.addEventListener('click', function(e){
    //   e.preventDefault();
    //   var myObj = {}
    //   myObj.author = e.target.parentNode.firstChild.childNodes[0].dataset.author;
    //   myObj.comment = e.target.parentNode.firstChild.childNodes[1].dataset.comment;
    //   console.log(myObj);
    //   editComment(e.target.dataset._id, myObj);
    // })

    divHolder.append(editButton);
    divHolder.append(deleteBtn);

    divComments.append(divHolder);
  }
}

//GETTING THE ADDED COMMENT DATA
document.querySelector('#addedComment').addEventListener('submit', function(e){
  e.preventDefault();
  var myObj = {}
  for (var i = 0; i < e.target.length-1; i++) {
    if(e.target[i].name == false || e.target[i].value == false){
      alert('Name and comment must include something');
      return;
    } else {
      var pubDate = new Date();
      myObj['_id'] = Math.random();
      myObj[e.target[i].name] = e.target[i].value;
      myObj['pubDate'] = pubDate.toString();
    }
  }
  console.log(myObj);
  addComment(myObj);
})


//EDIT FORM
document.querySelector('#editComment').addEventListener('submit', function(e){
  e.preventDefault();
  console.log(e);
  var myObj = {}
  for (var i = 0; i < e.target.length-1; i++) {
    if(e.target[i].name == false || e.target[i].value == false){
      alert('Name and comment must include something');
      return;
    } else {
      myObj[e.target[i].name] = e.target[i].value;
    }
  }
  editData(document.querySelector('#editBtn').dataset._id, myObj);
})



//DELETE COMMENT FROM INDEXDB
function deleteComment(event) {
  var deletedComment  = db.comments.delete(event.target.dataset._id);

  deletedComment.then(function(resolved) {
    console.log(resolved);
    deletedIDS.push(event.target.dataset._id)
    populateTableWithIndexDBData();
  }).catch(function(rejected) {
    console.log(rejected);
  });
}


//ADD COMMENT TO INDEXDB
function addComment(obj) {
    var addedComment = db.comments.put(obj);
    addedComment.then(function(resolved){
      console.log(resolved);
    }).catch(function(rejected) {
      console.log(rejected);
    });

    populateTableWithIndexDBData();
    addedComments.push(obj);
    // sanitizeComment(obj);
    document.querySelector('form').reset();
}




//EDIT COMMENT ON DB
function editComment(id, obj){
  var updatedComment = db.comments.update(id, obj);
  updatedComment.then(function(resolved){
    console.log(resolved);
  }).catch(function(rejected){
    console.log(rejected);
  });
  var updatedObj = obj;
  updatedObj.id = id
  populateTableWithIndexDBData();
  updatedComments.push(updatedObj);
}



// let db;
// async function playAround() {
//     db = new Dexie ('comment_database');
//     if (!(await Dexie.exists(db.comments))) {
//         alert("Db does not exist");
//         db.version(1).stores({
//             comments: '_id,author,comment,pubDate'
//         });
//     }
//     populateTableWithIndexDBData();
// }


// sanitizing comments to send to API
// function sanitizeComment(obj){
//   var newObj = {};
//   for (var key in obj) {
//     if(key === 'author'){
//       newObj['name'] = obj[key];
//     } else if(key === 'comment') {
//       newObj[key] = obj[key];
//     }
//   }
//   addedComments.push(newObj);
// }
