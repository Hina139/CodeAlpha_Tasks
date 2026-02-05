// 





const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location.href = "index.html";
} else {
    document.getElementById('profUser').innerText = user.username;
    const savedDP = localStorage.getItem(`dp_${user.username}`);
    const savedCover = localStorage.getItem(`cover_${user.username}`);
    if (savedDP) document.getElementById('myDP').src = savedDP;
    if (savedCover) document.getElementById('coverImg').src = savedCover;
}

window.onload = () => {
    loadMyPosts();
    fetchCounts(); 
};

// --- DATABASE SE REAL FOLLOWERS/FOLLOWING COUNT LANAY KA LOGIC ---
async function fetchCounts() {
    try {
        const res = await fetch(`http://localhost:5000/api/users/${user.username}`);
        if (res.ok) {
            const data = await res.json();
            // Arrays ki length check kar ke UI pe dikha rahe hain
            document.getElementById('followerCount').innerText = data.followers ? data.followers.length : 0;
            document.getElementById('followingCount').innerText = data.following ? data.following.length : 0;
        }
    } catch (err) {
        console.error("Counts load nahi ho sakay:", err);
    }
}

const demoPosts = [
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg",
    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
    "https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg",
    "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg",
    "https://images.pexels.com/photos/15286/pexels-photo.jpg",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg",
    "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg"
];

function updateDP(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('myDP').src = reader.result;
            localStorage.setItem(`dp_${user.username}`, reader.result);
            location.reload(); 
        };
        reader.readAsDataURL(file);
    }
}

function updateCover(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('coverImg').src = reader.result;
            localStorage.setItem(`cover_${user.username}`, reader.result);
        };
        reader.readAsDataURL(file);
    }
}

function toggleDelMenu(postId) {
    const menu = document.getElementById(`del-${postId}`);
    const isVisible = menu.style.display === 'block';
    document.querySelectorAll('.delete-btn-pop').forEach(m => m.style.display = 'none');
    menu.style.display = isVisible ? 'none' : 'block';
}

async function confirmDelete(postId) {
    if (confirm("Kyu bhai, post delete karni hai?")) {
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${postId}`, { method: 'DELETE' });
            if (res.ok) { loadMyPosts(); }
        } catch (err) { console.error(err); }
    }
}

async function loadMyPosts() {
    const grid = document.getElementById('profileGrid');
    try {
        const res = await fetch('http://localhost:5000/api/posts');
        const posts = await res.json();
        const myPosts = posts.filter(p => p.username === user.username);
        
        if (myPosts.length > 0) {
            document.getElementById('postCount').innerText = myPosts.length;
            grid.innerHTML = myPosts.map(p => `
                <div class="grid-item">
                    <i class="fas fa-ellipsis-v post-options" onclick="toggleDelMenu('${p._id}')"></i>
                    <div class="delete-btn-pop" id="del-${p._id}"><button onclick="confirmDelete('${p._id}')">Delete</button></div>
                    ${p.mediaType === 'video' ? `<video src="http://localhost:5000${p.mediaUrl}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>` : `<img src="http://localhost:5000${p.mediaUrl}">`}
                </div>`).join('');
        } else {
            document.getElementById('postCount').innerText = demoPosts.length;
            grid.innerHTML = demoPosts.map(img => `<div class="grid-item"><img src="${img}"></div>`).join('');
        }
    } catch (err) { console.error(err); }
}

window.onclick = function(event) {
    if (!event.target.matches('.post-options')) {
        document.querySelectorAll('.delete-btn-pop').forEach(m => m.style.display = 'none');
    }
}