//GLOBAL VARIABLES FOR COMPARISON
var deletedIDS = [];
var addedComments = [];
console.log(addedComments);


 (async function getCommentsFromAPI() {
   if(addedComments){
     for (var i = 0; i < addedComments.length; i++) {
       await postData(`https://us-central1-fir-cb-backend.cloudfunctions.net/api/comment/`, addedComments[i]);
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
    var getComments = await fetch("https://us-central1-fir-cb-backend.cloudfunctions.net/api/comment/")
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
    setTimeout(getCommentsFromAPI, 1000000);
    console.log('IndexDB reload');
})();



//POPULATE UI WITH IndexDB DATA
async function populateTableWithIndexDBData(){
  var divComments = document.querySelector('.comments');
  divComments.innerHTML = '';
  let comments = await db.comments.toArray();
  for (var i = 0; i < comments.length; i++) {
    var divHolder = document.createElement('div');
    var list = document.createElement('ul');

    var listAuthor = document.createElement('li');
    listAuthor.innerText = comments[i].author;
    listAuthor.dataset.author = comments[i].author;
    list.append(listAuthor);

    var listComment = document.createElement('li');
    listComment.innerText = comments[i].comment;
    listComment.dataset.comment = comments[i].comment;
    list.append(listComment);

    divHolder.append(list);
    divHolder.addClassName = "smallComments";

    var deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete this comment?';
    deleteBtn.dataset._id = comments[i]._id;
    deleteBtn.addEventListener('click', function(e){
      e.preventDefault();
      deleteComment(e);
    })
    divHolder.append(deleteBtn);

    divComments.append(divHolder);
  }
}

//GETTING THE ADDED COMMENT DATA
document.querySelector('form').addEventListener('submit', function(e){
  e.preventDefault();
  var myObj = {}
  for (var i = 0; i < e.target.length-1; i++) {
    console.log(typeof e.target[i].name);
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


//DELETE COMMENT FROM INDEXDB
function deleteComment(event) {
  var deletedBook  = db.comments.delete(event.target.dataset._id);

  deletedBook.then(function(resolved) {
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
    sanitizeComment(obj);
}

// sanitizing comments to send to API
function sanitizeComment(obj){
  var newObj = {};
  for (var key in obj) {
    if(key === 'author'){
      newObj['name'] = obj[key];
    } else if(key === 'comment') {
      newObj[key] = obj[key];
    }
  }
  addedComments.push(newObj);
}
