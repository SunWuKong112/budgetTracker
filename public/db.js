let db;
// create a new db request for a "budget" database.
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  const db = request.result

  db.createObjectStore("pendingOS", {autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pendingOS"], "readwrite");
  // access your pending object store
  const pendingOS= transaction.objectStore("budget");
  // add record to your store with add method.
  pending.add(record);
}

function checkDatabase() {
  const db = request.result;
  // open a transaction on your pending db
  const transaction = db.transaction("pending");
  // access your pending object store
  const pending = transaction.objectStore("pending");
  // get all records from store and set to a variable
  const getAll = pendingOS.getAll(record);
  getRecords.onsuccess = ()=>{
    console.log(getRecords.result);
  };


  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["pendingOS"], "readwrite");
          const pendingOS = transaction.objectStore("pendingOS");
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);