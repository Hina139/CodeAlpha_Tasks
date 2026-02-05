const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('uNameDisplay').innerText = user.username;

// Naya logic: Profile DP ko yahan show karne ke liye
const savedDP = localStorage.getItem(`dp_${user.username}`);
if (savedDP) {
    const avMini = document.querySelector('.av-mini');
    if (avMini) avMini.src = savedDP;
}

let currentFile = null;

function handlePreview(e) {
    currentFile = e.target.files[0];
    if (!currentFile) return;

    const url = URL.createObjectURL(currentFile);
    const pBox = document.getElementById('pBox');

    pBox.innerHTML = ''; 

    if (currentFile.type.startsWith('video')) {
        pBox.innerHTML = `
            <video 
                src="${url}" 
                id="previewVid"
                controls 
                autoplay 
                muted
                playsinline
                style="width:100%; max-height:100%; object-fit:contain; display:block;">
            </video>`;
        
        const v = document.getElementById('previewVid');
        v.addEventListener('loadedmetadata', () => {
            v.controls = true; 
        });
    } else {
        pBox.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:contain;">`;
    }
}

function addEmo(emo) {
    document.getElementById('capText').value += emo;
}

async function submitPost() {
    if (!currentFile) return alert("Please select a photo or video!");
    const fd = new FormData();
    fd.append('media', currentFile);
    fd.append('username', user.username);
    fd.append('caption', document.getElementById('capText').value);
    const btn = document.querySelector('.share-btn');
    btn.innerText = "Sharing...";
    btn.disabled = true;
    try {
        const res = await fetch('http://localhost:5000/api/posts/create', { method: 'POST', body: fd });
        if (res.ok) { alert("Post Created!"); window.location.href = "dashboard.html"; }
        else { alert("Upload failed!"); btn.innerText = "Share"; btn.disabled = false; }
    } catch (err) { console.error(err); btn.innerText = "Share"; btn.disabled = false; }
}