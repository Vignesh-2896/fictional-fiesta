let myLibrary = []; // Array to hold object's of Book.

let editBookDiv = document.querySelector("#edit_book_details");
let tbody = document.querySelector("#table_body");
let formElements = document.getElementById("add_new_book_form").elements;
let storageType = "";
let currentDisplay = "";

function Book(bookTitle, bookAuthor, bookLength, bookStatus){
    this.name = bookTitle;
    this.author = bookAuthor;
    this.pages = bookLength;
    this.status = bookStatus;
};

function BookArray(){

}

BookArray.prototype.fetchBook = function(){ // Function to retrieve all properties of a Book Object as an Array
    tmpArray = [this.name, this.author, this.pages, this.status];
    return tmpArray;
};

BookArray.prototype.updateStatus = function(editBookStatus){    // Function to update status property for a Book Status
    this.status = editBookStatus;
}

Book.prototype = Object.create(BookArray.prototype);        // Attach prototype functions.

let addBookDisplay = document.querySelector("#add_book_button");
addBookDisplay.addEventListener("click", function(){    // Function to display form to input new books.
    if(storageType != ""){          // Addition of new books is only possible after Storage type has been selected.
        let addBookDiv = document.querySelector("#add_new_book");
        displayDiv(addBookDiv);
    } else {
        alert("Please select a storage type before adding a new book.")
    }
});

let addBookSubmit = document.querySelector("#add_book_submit");
addBookSubmit.addEventListener("click",function(){  // Function to add new books to list based on data input in form.

    proceedToAddFlag = true;
    for(let i=0;i<formElements.length-1;i++){       // Validation to check if all form elements for adding a book are present.
        if(formElements[i].value == ""){
            proceedToAddFlag = false;
        }
    }

    if(proceedToAddFlag){
        addBookToLibrary();
        let addBookDiv = document.querySelector("#add_new_book");
        hideDiv(addBookDiv);    
    } else {
        alert("Kindly enter value to all the fields.")
    }

});

editBookDiv.addEventListener("click",function(){    // Function to Edit status of Book
    let editBookSubmit = document.getElementById("edit_book_form").elements;

    bookObjectPostition = document.getElementById("edit_book_status").getAttribute("data-list-pos"); // Get Array position of the Object in myLibrary array
    requiredBookObject = myLibrary[bookObjectPostition];
    if(requiredBookObject.status != editBookSubmit[0].value){
        requiredBookObject.updateStatus(document.getElementById("edit_book_status").value)
        hideDiv(editBookDiv);
        displayLibrary();       // Once a Book's status has been updated, the table is rebuilt once more.
        updateStorage();     
    } else {
        alert("Same Book Status selected. Please choose a different one.")
    }
});

let storageDisplay = document.querySelector("#select_storage_button");
storageDisplay.addEventListener("click", function(){        // Function to display storage choices.
    let storageDiv = document.querySelector("#select_storage");
    displayDiv(storageDiv);
});

function addBookToLibrary(){
    let bookTitle = formElements[0].value;
    let bookAuthor = formElements[1].value;
    let bookLength = formElements[2].value;
    let bookStatus = formElements[3].value;

    document.getElementById("add_new_book_form").reset();

    B1 = new Book(bookTitle, bookAuthor, bookLength, bookStatus);   // New object created with the inputs from the form.
    
    myLibrary.push(B1);
    displayLibrary();
    updateStorage();
};

function displayLibrary(){
    let totalBookCount = 1;

    while(tbody.firstChild){            // Before displaying elements, current contents of table are deleted.
        tbody.removeChild(tbody.firstChild);
    }
    myLibrary.forEach(function(currentBook){
        
        let tr = document.createElement("tr");
        
        let td0 = document.createElement("td");
        td0.textContent = totalBookCount;
        tr.appendChild(td0);

        let bookDets = currentBook.fetchBook();
        for(let i=0;i<bookDets.length;i++){         // Loop to display all properties of current book.
            let td1 = document.createElement("td");
            td1.textContent = bookDets[i];
            tr.appendChild(td1);
        }

        addButtons = ["edit","delete"];
        addButtons.forEach(function(curButton){     // Loop to add Edit and Delete buttons for current Book.
            let td5 = document.createElement("td");
            let button = document.createElement("button");
            button.setAttribute("data-list-pos",totalBookCount - 1)     // To identify, which book object's details are present in any row, 
            button.setAttribute("id",curButton);                        // data attribute is used to show the array position of the object in myLibrary array.
            button.textContent = curButton.charAt(0).toUpperCase() + curButton.slice(1);
            td5.appendChild(button);
            tr.appendChild(td5);
        });

        totalBookCount += 1

        tbody.appendChild(tr);
    });
// Attaching functions to Edit and Delete buttons.
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

function displayEdit(curBookRow){ // function to edit a book.

    bookObjectPostition = curBookRow.getAttribute("data-list-pos");
    requiredBookObject = myLibrary[bookObjectPostition];

    displayDiv(editBookDiv); 

    document.getElementById("edit_book_id").textContent = requiredBookObject.name;
    document.getElementById("edit_book_status").value = requiredBookObject.status;
    document.getElementById("edit_book_status").setAttribute("data-list-pos",bookObjectPostition);

};

function deleteBook(curBookRow){        // function to delete a book.
    bookObjectPostition = curBookRow.getAttribute("data-list-pos");
    delete myLibrary[bookObjectPostition];
    displayLibrary();
    updateStorage(); 
};

function setupStorage(storageSelected){     // function to setup Storage connections.
    storageType = storageSelected.getAttribute("data-storage");
    let storageDiv = document.querySelector("#select_storage");
    hideDiv(storageDiv);

    if(storageType == "local" && localStorage.getItem("books-array")){
        fetchedBookList = JSON.parse(localStorage.getItem("books-array"));
        fetchedBookList.forEach(pushToLibrary);    // Data is fetched from local Storage and pushed to the myLibrary array.
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
            snapshot.val().forEach(pushToLibrary);  // Data is fetched from Firebase DB and pushed to the myLibrary array.        
        });
    }
    alert("Please give a few seconds to setup connection to your Storage choice.")    
    setTimeout(function(){
        displayLibrary();
        alert("You can start adding books now !");
    },4000);
}

function updateStorage(){       // Function to update the storage. The contents of myLibrary array are stored since they hold all the required objects.
    if (storageType == "local"){
        localStorage.clear();
        localStorage.setItem("books-array",JSON.stringify(myLibrary));
    } else {
        firebase.database().ref("BookObjects/").set(myLibrary);
    }
}

function hideDiv(divElement){   // Function to hide a Div Element after its processing is complete.
    divElement.style.visibility = "hidden"; 
    divElement.style.height = "0%"; 
    currentDisplay = "";
}

function displayDiv(divElement){    // Function to Display a Div Element for user input.
    if(currentDisplay == ""){
        divElement.style.visibility = "visible";
        divElement.style.height = "auto";
        currentDisplay = divElement.getAttribute("name");
    } else {        // to avoid overlap of multiple DIVs, at a time only one DIV Element can be displayed.
        alert("Your request operation can't be processed. Currenly "+currentDisplay+" operation is being serviced.");
    }
}

function pushToLibrary(fetchedBook){    // Function to append contents of storage to myLibrary array.
    if(fetchedBook != null){
        b = new Book();
        Object.assign(b,fetchedBook)    // Assign function is used to copy the stored content details into a new Book object.
        myLibrary.push(b);              // This will help in further processing.
    }
}