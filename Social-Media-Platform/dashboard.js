const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = "index.html";

let currentPostId = null; 

window.onload = () => {
    updateSidebar();
    loadFeed();
    loadSuggestions();
};

function updateSidebar() {
    const uNameEl = document.getElementById('uName');
    if(uNameEl) uNameEl.innerText = user.username;
    const savedDP = localStorage.getItem(`dp_${user.username}`);
    const sideAv = document.getElementById('sideAv');
    if (savedDP && sideAv) sideAv.src = savedDP;
}

function loadSuggestions() {
    const suggestions = ['john_doe', 'travel_vlogs', 'chef_pro', 'tech_guru', 'art_vibes'];
    const list = document.getElementById('suggestionList');
    if (list) {
        list.innerHTML = suggestions.map(u => `
            <div class="suggestion">
                <img src="https://i.pravatar.cc/150?u=${u}">
                <b>${u}</b>
                <button onclick="toggleFollowBtn(this, '${u}')">Follow</button>
            </div>`).join('');
    }
}

// --- UPDATED FOLLOW FUNCTION (Calls MongoDB) ---
async function toggleFollowBtn(btn, targetUser) {
    try {
        const res = await fetch('http://localhost:5000/api/auth/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentUser: user.username, targetUser: targetUser })
        });
        
        if (res.ok) {
            if (btn.innerText.trim() === 'Follow') {
                btn.innerText = 'Following';
                btn.style.color = '#8e8e8e';
            } else {
                btn.innerText = 'Follow';
                btn.style.color = '#9333ea';
            }
        }
    } catch (err) { console.error("Follow error:", err); }
}

async function loadFeed() {
    try {
        const res = await fetch('http://localhost:5000/api/posts');
        const posts = await res.json();
        const feed = document.getElementById('postFeed');
        const favs = JSON.parse(localStorage.getItem('favs') || "[]");

        feed.innerHTML = posts.map(p => {
            const isLiked = p.likes.includes(user.username);
            const isFav = favs.includes(p._id);
            const mediaFullUrl = `http://localhost:5000${p.mediaUrl}`;

            return `
            <div class="post-card" id="post-${p._id}">
                <div class="p-header" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px;">
                    <div class="p-user" style="display: flex; align-items: center; gap: 10px;">
                        <img src="https://i.pravatar.cc/150?u=${p.username}" class="av-mini">
                        <b style="color: white;">${p.username}</b>
                    </div>
                    
                    <div class="p-actions-top" style="display: flex; align-items: center; gap: 12px;">
                        ${p.username !== user.username ? 
                            `<span class="follow-btn-main" onclick="toggleFollowBtn(this, '${p.username}')" style="color:#9333ea; font-size:13px; font-weight:bold; cursor:pointer;">Follow</span>` : ''}

                        <div class="p-options" style="position:relative;">
                            <i class="fas fa-ellipsis-v" onclick="toggleMenu('${p._id}')" style="cursor:pointer; color: white; padding: 5px; font-size: 16px;"></i>
                            <div id="menu-${p._id}" class="post-menu" style="display:none; position:absolute; right:0; top: 25px; background:#262626; border:1px solid #444; border-radius:8px; z-index:100; min-width:140px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                                ${p.username === user.username ? 
                                    `<button onclick="deletePost('${p._id}')" style="color:#ff3b30; width:100%; padding:10px; background:none; border:none; cursor:pointer; text-align:left;">Delete Post</button>` : 
                                    `<button disabled style="color:gray; width:100%; padding:10px; background:none; border:none; text-align:left;">Report</button>`}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-media">
                    ${p.mediaType === 'video' ? 
                        `<video src="${mediaFullUrl}" class="res-video" controls loop muted autoplay playsinline></video>` : 
                        `<img src="${mediaFullUrl}" class="res-img">`}
                </div>

                <div class="p-actions">
                    <div class="btns">
                        <i class="${isLiked ? 'fas' : 'far'} fa-heart" style="color:${isLiked ? 'red' : 'white'}" onclick="toggleLike('${p._id}')"></i>
                        <i class="far fa-comment" onclick="openComments('${p._id}')"></i>
                    </div>
                    <i class="${isFav ? 'fas' : 'far'} fa-bookmark" style="color:${isFav ? 'gold' : 'white'}" onclick="toggleFav('${p._id}')"></i>
                </div>
                
                <div class="p-info">
                    <b>${p.likes.length} likes</b><br>
                    <b>${p.username}</b> ${p.caption}
                    <p class="view-cmt" onclick="openComments('${p._id}')" style="color:gray; cursor:pointer; margin-top:5px;">View comments</p>
                </div>
            </div>`;
        }).join('');
    } catch (err) { console.error("Feed error:", err); }
}

function toggleMenu(id) {
    const menu = document.getElementById(`menu-${id}`);
    const isVisible = menu.style.display === 'block';
    document.querySelectorAll('.post-menu').forEach(m => m.style.display = 'none');
    menu.style.display = isVisible ? 'none' : 'block';
}

async function deletePost(id) {
    if(!confirm("Are you sure?")) return;
    try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`, { method: 'DELETE' });
        if(res.ok) document.getElementById(`post-${id}`).remove();
    } catch (err) { alert("Delete failed!"); }
}

function openComments(id) {
    currentPostId = id;
    document.getElementById('commentModal').style.display = 'flex';
    const footer = document.querySelector('.c-footer');
    footer.innerHTML = `
        <div class="emoji-bar">
            ${['❤️','🔥','🙌','✨','😂','😍','😢'].map(e => `<span onclick="addEmoji('${e}')">${e}</span>`).join('')}
        </div>
        <div class="input-row">
            <input type="text" id="cInp" placeholder="Add a comment...">
            <button onclick="sendComment()">Post</button>
        </div>
    `;
    fetchComments(id);
}

function addEmoji(emoji) {
    const input = document.getElementById('cInp');
    input.value += emoji;
    input.focus();
}

function closeComments() {
    document.getElementById('commentModal').style.display = 'none';
}

async function fetchComments(postId) {
    const res = await fetch('http://localhost:5000/api/posts');
    const posts = await res.json();
    const post = posts.find(p => p._id === postId);
    const cList = document.getElementById('cList');
    if(post && post.comments) {
        cList.innerHTML = post.comments.map(c => `<div class="cmt"><b>${c.username}</b>: ${c.text}</div>`).join('');
    }
}

async function sendComment() {
    const text = document.getElementById('cInp').value;
    if(!text) return;
    try {
        const res = await fetch(`http://localhost:5000/api/posts/comment/${currentPostId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, text: text })
        });
        if(res.ok) {
            document.getElementById('cInp').value = '';
            fetchComments(currentPostId);
        }
    } catch (err) { console.error("Comment failed"); }
}

async function toggleLike(id) {
    await fetch(`http://localhost:5000/api/posts/like/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username })
    });
    loadFeed();
}

function toggleFav(postId) {
    let favs = JSON.parse(localStorage.getItem('favs') || "[]");
    favs.includes(postId) ? favs = favs.filter(i => i !== postId) : favs.push(postId);
    localStorage.setItem('favs', JSON.stringify(favs));
    loadFeed();
}

function logout() { localStorage.clear(); window.location.href = "index.html"; }