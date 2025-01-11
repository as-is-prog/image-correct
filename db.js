// IndexedDBに接続するための関数
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('cleaningPhotoLogDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('photoLogs')) {
                db.createObjectStore('photoLogs', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// データを保存するための関数
async function saveData(data) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['photoLogs'], 'readwrite');
        const objectStore = transaction.objectStore('photoLogs');
        objectStore.clear(); // 既存データをクリア
        const request = objectStore.add({ id: 1, data: data });

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// データを読み出すための関数
async function loadData() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['photoLogs'], 'readonly');
        const objectStore = transaction.objectStore('photoLogs');
        const request = objectStore.get(1);

        request.onsuccess = (event) => {
            resolve(event.target.result ? event.target.result.data : null);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}
