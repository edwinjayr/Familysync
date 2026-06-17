// Add these constants at the very top of your script
// Replace the hardcoded keys with your Worker URL
const WORKER_URL = 'https://wispy-bonus-468e.edwinjayr.workers.dev/';

async function init() {
    const response = await fetch(`${WORKER_URL}`, { method: 'GET' });
    const json = await response.json();
    data = json.record;
    // ... rest of your init
}

async function save() {
    await fetch(`${WORKER_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    // ... rest of your save
}

// --- NEW DATA SYNC FUNCTIONS ---

async function init() {
    // Fetch data from JSONBin on startup
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
        });
        const json = await response.json();
        data = json.record; // Update global data object
    } catch (error) {
        console.error("Failed to load from JSONBin", error);
    }
    
    // Auth logic remains the same
    const savedUser = sessionStorage.getItem('fs_currentUser');
    if (savedUser) {
        const user = data.members.find(m => m.id === savedUser);
        if (user) {
            currentUser = user;
            isAdmin = (user.name.toLowerCase() === 'daddy' || user.name.toLowerCase() === 'mommy');
            finishLogin();
        } else { renderLoginScreen(); }
    } else {
        renderLoginScreen();
    }
    
    // Start Widgets
    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchWeather();
}

async function save() {
    // Push data to JSONBin
    try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY
            },
            body: JSON.stringify(data)
        });
        // Refresh UI only after successful save
        if(currentUser) renderAll();
    } catch (error) {
        console.error("Failed to save to JSONBin", error);
        alert("Sync failed! Check your internet connection.");
    }
}
