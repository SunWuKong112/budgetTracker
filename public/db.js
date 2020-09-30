const windexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexdDB || window.msIndexeDB;
let db;
const request = windexDB.open("budget", 1);
console.log(`Database loaded.`);

if (!windexDB){
  //Some kind of alert?
}

request.onupgradeneeded = function (event) {
  const db = request.result
  db.createObjectStore("pending", {autoIncrement: true });
};

request.onsuccess = (e)=>{
  console.log(`onsuccess function called`);
  db = e.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log(`Error: ${event.target.errorCode}`);
};

function saveRecord(record) {
  console.log(`${record} saved.`);
  const tx = db.transaction(["pending"], "readwrite");
  const pending= tx.objectStore("pending");
  pending.add(record);
}

function checkDatabase() {
  const tx = db.transaction(["pending"], "readwrite");
  const pending = tx.objectStore("pending");
  const getAll = pending.getAll();


  getAll.onsuccess = function () {
    console.log(getAll.result);
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
        const tx = db.transaction(["pending"], "readwrite");
        const pending = tx.objectStore("pending");
        pending.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);