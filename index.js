let myLibrary = [];

let editBookDiv = document.querySelector("#edit_book_details");
let tbody = document.querySelector("#table_body");
let formElements = document.getElementById("add_new_book_form").elements;
let storageType = "";

function Book(bookTitle, bookAuthor, bookLength, bookStatus = "To Be Read"){
    this.name = bookTitle;
    this.author = bookAuthor;
    this.pages = bookLength;
    this.status = bookStatus;
};

function BookArray(){

}

BookArray.prototype.fetchBook = function(){
    tmpArray = [this.name, this.author, this.pages, this.status];
    return tmpArray;
};

BookArray.prototype.updateStatus = function(editBookStatus){
    this.status = editBookStatus;
}

Book.prototype = Object.create(BookArray.prototype);

let addBookDisplay = document.querySelector("#add_book_button");
addBookDisplay.addEventListener("click", function(){
    if(storageType != ""){
        let addBookDiv = document.querySelector("#add_new_book");
        addBookDiv.style.visibility = "visible";
        addBookDiv.style.height = "auto";
    } else {
        alert("Please select a storage type before adding a new book.")
    }
});

let addBookSubmit = document.querySelector("#add_book_submit");
addBookSubmit.addEventListener("click",function(){

    proceedToAddFlag = true;
    for(let i=0;i<formElements.length-1;i++){
        if(formElements[i].value == ""){
            proceedToAddFlag = false;
        }
    }

    if(proceedToAddFlag){
        addBookToLibrary();
        let addBookDiv = document.querySelector("#add_new_book");
        addBookDiv.style.visibility = "hidden"; 
        addBookDiv.style.height = "0%";         
    } else {
        alert("Kindly enter value to all the fields.")
    }

});

let editBookSubmit = document.querySelector("edit_book_submit");
editBookDiv.addEventListener("click",function(){

    let editBookSubmit = document.getElementById("edit_book_form").elements;

    bookObjectPostition = document.getElementById("edit_book_status").getAttribute("data-list-pos");
    requiredBookObject = myLibrary[bookObjectPostition];
    if(requiredBookObject.status != editBookSubmit[0].value){
        requiredBookObject.updateStatus(document.getElementById("edit_book_status").value)
        editBookDiv.style.visibility = "hidden";
        editBookDiv.style.height = "0%";   
        displayLibrary();
        updateStorage();     
    } else {
        alert("Same Book Status selected. Please choose a different one.")
    }
});

let storageDisplay = document.querySelector("#select_storage_button");
storageDisplay.addEventListener("click", function(){
    let storageDiv = document.querySelector("#select_storage");
    storageDiv.style.visibility = "visible";
    storageDiv.style.height = "auto"; 
});

function addBookToLibrary(){
    let bookTitle = formElements[0].value;
    let bookAuthor = formElements[1].value;
    let bookLength = formElements[2].value;
    let bookStatus = formElements[3].value;

    document.getElementById("add_new_book_form").reset();

    B1 = new Book(bookTitle, bookAuthor, bookLength, bookStatus);
    
    myLibrary.push(B1);
    displayLibrary();
    updateStorage();
};

function displayLibrary(){
    let totalBookCount = 1;

    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
    myLibrary.forEach(function(currentBook){
        
        let tr = document.createElement("tr");
        
        let td0 = document.createElement("td");
        td0.textContent = totalBookCount;
        tr.appendChild(td0);

        let bookDets = currentBook.fetchBook();
        for(let i=0;i<bookDets.length;i++){
            let td1 = document.createElement("td");
            td1.textContent = bookDets[i];
            tr.appendChild(td1);
        }

        addButtons = ["edit","delete"];
        addButtons.forEach(function(curButton){
            let td5 = document.createElement("td");
            let button = document.createElement("button");
            button.setAttribute("data-list-pos",totalBookCount - 1)
            button.setAttribute("id",curButton);
            button.textContent = curButton.charAt(0).toUpperCase() + curButton.slice(1);
            td5.appendChild(button);
            tr.appendChild(td5);
        });

        totalBookCount += 1

        tbody.appendChild(tr);
    });

    document.querySelectorAll("#edit").forEach(editButton => {
        editButton.addEventListener("click",function(){
            displayEdit(editButton);
        });
    });

    document.querySelectorAll("#delete").forEach(deleteButton => {
        deleteButton.addEventListener("click",function(){
            deleteBook(deleteButton);
        });
    });

};

function displayEdit(curBookRow){

    bookObjectPostition = curBookRow.getAttribute("data-list-pos");
    requiredBookObject = myLibrary[bookObjectPostition];

    editBookDiv.style.visibility = "visible";
    editBookDiv.style.height = "auto"; 

    document.getElementById("edit_book_id").textContent = requiredBookObject.name;
    document.getElementById("edit_book_status").value = requiredBookObject.status;
    document.getElementById("edit_book_status").setAttribute("data-list-pos",bookObjectPostition);

};

function deleteBook(curBookRow){
    bookObjectPostition = curBookRow.getAttribute("data-list-pos");
    delete myLibrary[bookObjectPostition];
    displayLibrary();
    updateStorage(); 
};

if(localStorage.getItem("books-array")){

}

function setupStorage(storageSelected){
    storageType = storageSelected.getAttribute("data-storage");
    let storageDiv = document.querySelector("#select_storage");
    storageDiv.style.visibility = "hidden";
    storageDiv.style.height = "0%";     

    if(storageType == "local" && localStorage.getItem("books-array")){
        fetchedBookList = JSON.parse(localStorage.getItem("books-array"));
        fetchedBookList.forEach(function(fetchedBook){
            if(fetchedBook != null){
                b = new Book();
                Object.assign(b,fetchedBook);
                myLibrary.push(b);
            }
        });
    } else {
          // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyC4mgJoiumM9JMgKBgf2-JVV1u4F7eBFUI",
            authDomain: "library-app-ced96.firebaseapp.com",
            projectId: "library-app-ced96",
            databaseURL: "https://library-app-ced96-default-rtdb.firebaseio.com/",
            storageBucket: "library-app-ced96.appspot.com",
            messagingSenderId: "992271486475",
            appId: "1:992271486475:web:af7a28e493e71130b7c10e"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        var databaseStuff = firebase.database().ref("BookObjects/");
        databaseStuff.on("value",function(snapshot){
            snapshot.val().forEach(function(fetchedBook){
                b = new Book();
                Object.assign(b,fetchedBook)
                myLibrary.push(b);
            });          
        });
    }
    setTimeout(function(){
        displayLibrary();
    },5000);
}

function updateStorage(){
    if (storageType == "local"){
        localStorage.clear();
        localStorage.setItem("books-array",JSON.stringify(myLibrary));
    } else {
        firebase.database().ref("BookObjects/").set(myLibrary);
    }
}