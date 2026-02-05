const user = JSON.parse(localStorage.getItem('user'));
let activePostId = null;

window.onload = () => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    loadSavedCover();
    loadFavs();
};

// Computer se Cover Image change karke save karna
function uploadLocalFile(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            document.getElementById('coverImg').src = base64Data;
            localStorage.setItem('my_fav_cover', base64Data);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function loadSavedCover() {
    const saved = localStorage.getItem('my_fav_cover');
    if (saved) document.getElementById('coverImg').src = saved;
}

// Render Saved Posts
async function loadFavs() {
    const container = document.getElementById('favFeed');
    const favIds = JSON.parse(localStorage.getItem('favs') || "[]");

    try {
        const res = await fetch('http://localhost:5000/api/posts');
        const posts = await res.json();
        const favPosts = posts.filter(p => favIds.includes(p._id));

        if (favPosts.length === 0) {
            container.innerHTML = `<p style="color:gray; text-align:center; padding:50px;">No saved posts.</p>`;
            return;
        }

        container.innerHTML = favPosts.map(p => `
            <div class="post-card">
                <div class="p-header" style="padding:15px; display:flex; align-items:center; gap:10px;">
                    <img src="https://i.pravatar.cc/150?u=${p.username}" style="width:32px; height:32px; border-radius:50%;">
                    <b style="color:white;">${p.username}</b>
                </div>
                <div class="p-media">
                    ${p.mediaType === 'video' ? 
                        `<video src="http://localhost:5000${p.mediaUrl}" controls loop muted></video>` : 
                        `<img src="http://localhost:5000${p.mediaUrl}">`}
                </div>
                <div class="p-actions" style="padding:15px; display:flex; justify-content:space-between; color:white;">
                    <div style="display:flex; gap:15px; font-size:20px;">
                        <i class="${p.likes.includes(user.username) ? 'fas' : 'far'} fa-heart" 
                           style="color:${p.likes.includes(user.username) ? 'red' : 'white'}" 
                           onclick="toggleLike('${p._id}')"></i>
                        <i class="far fa-comment" onclick="openComments('${p._id}')"></i>
                    </div>
                    <i class="fas fa-bookmark" style="color:gold; font-size:22px; cursor:pointer;" onclick="removeFav('${p._id}')"></i>
                </div>
                <div class="p-info" style="padding:0 15px 15px; color:white;">
                    <b>${p.likes.length} likes</b><br>
                    <b>${p.username}</b> ${p.caption}
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

async function toggleLike(postId) {
    await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username })
    });
    loadFavs();
}

function removeFav(id) {
    let favs = JSON.parse(localStorage.getItem('favs') || "[]");
    favs = favs.filter(f => f !== id);
    localStorage.setItem('favs', JSON.stringify(favs));
    loadFavs(); 
}

function closeComments() { document.getElementById('commentModal').style.display = 'none'; }