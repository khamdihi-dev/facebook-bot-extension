// === STYLES ===
const styles = `
#zara-tag-container {
    position: fixed;
    top: 100px;
    left: 100px;
    width: 360px;
    background: white;
    border-radius: 12px;
    border:1px solid #ccc;
    box-shadow:0 12px 48px rgba(0,0,0,0.2);
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    z-index: 999999;
    user-select: none;
}

#zara-tag-header {
    padding:8px 12px;
    cursor: grab;
    background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
    color:white;
    font-weight:600;
    border-radius:12px 12px 0 0;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

#zara-tag-header button.close-btn {
    background: transparent;
    border:none;
    color:white;
    font-size:16px;
    cursor:pointer;
}

#zara-tag-content {
    padding:10px;
}

#zara-tag-container button.action-btn {
    border:none;
    padding:6px 12px;
    border-radius:8px;
    background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
    color:white;
    cursor:pointer;
    margin:2px 0;
    font-weight:600;
    transition: all 0.2s ease;
}

#zara-tag-container button.action-btn:hover {
    transform: scale(1.05);
}

#zara-tag-container input[type="text"],
#zara-tag-container input[type="number"] {
    width:100%;
    padding:5px;
    margin:5px 0;
    border-radius:6px;
    border:1px solid #ddd;
}

#friendList {
    max-height:200px; 
    overflow:auto; 
    border:1px solid #ddd; 
    margin:5px 0; 
    padding:5px;
    border-radius:8px;
}

.friend-chunk {
    border:1px solid #ddd; 
    margin:5px 0; 
    padding:5px; 
    border-radius:6px;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.friend-chunk input[type="checkbox"] {
    margin-right:8px;
}

.friend-chunk span.status {
    font-size:12px; 
    color:#555;
}

#loading-overlay {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background: rgba(255,255,255,0.7);
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:16px;
    font-weight:600;
    color:#c06c84;
    border-radius:12px;
    display:none;
}
#photo-preview {
    max-width: 100%;
    max-height: 150px;
    margin: 10px 0;
    border-radius: 8px;
    display: none;
}
`;

export function Tagmyfriend(container, config) {
    // Inject styles
    const origin = window.location.origin
    let selectedPhotoFile = null;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Storage functions
    async function getFriends(uid) {
        return new Promise(resolve => {
            chrome.storage.local.get([`friends_${uid}`], result => resolve(result[`friends_${uid}`] || []));
        });
    }

    async function saveFriends(uid, friends) {
        return new Promise(resolve => chrome.storage.local.set({ [`friends_${uid}`]: friends }, () => resolve()));
    }

    async function getTagged(uid) {
        return new Promise(resolve => chrome.storage.local.get([`tagged_${uid}`], result => resolve(result[`tagged_${uid}`] || [])));
    }

    async function saveTagged(uid, tagged) {
        return new Promise(resolve => chrome.storage.local.set({ [`tagged_${uid}`]: tagged }, () => resolve()));
    }

    // Render UI
    async function renderUI() {
        const uid = config.av;
        const friends = await getFriends(uid);
        const tagged = await getTagged(uid);

        container.innerHTML = `
            <div id="zara-tag-container">
                <div id="zara-tag-header">
                    Tag Teman
                    <button class="close-btn">&times;</button>
                </div>
                <div id="zara-tag-content">
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="action-btn" id="dumpFriends">Dump Teman</button>
                        <button class="action-btn" id="deleteFriends">Hapus Semua Teman</button>
                    </div>
                    <input type="text" id="caption" placeholder="Tulis caption...">
                    <input type="number" id="delay" placeholder="Delay (ms)">
                    <div style="margin: 10px 0;">
                        <label style="display:block; margin-bottom:5px; font-weight:600; color:#333;">Upload Foto (untuk Tag with img):</label>
                        <input type="file" id="photoInput" accept="image/*">
                        <img id="photo-preview" alt="Preview">
                    </div>
                    <div id="friendList"></div>
                    <button class="action-btn" id="startTagging">Tag with img</button>
                    <button class="action-btn" id="startTaggingOnlyLink">Tag only caption</button>
                    <div id="status" style="margin-top:10px;"></div>
                </div>
                <div id="loading-overlay">Loading...</div>
            </div>
        `;

        document.querySelector('#zara-tag-header .close-btn').onclick = () => container.remove()
        document.getElementById('dumpFriends').onclick = dumpFriends;
        document.getElementById('deleteFriends').onclick = deleteFriends;
        document.getElementById('startTagging').onclick = startTagging;
        document.getElementById('startTaggingOnlyLink').onclick = startTaggingonlyLink;
        document.getElementById('photoInput').addEventListener('change', handlePhotoSelect);


        renderFriendListSummary(friends, tagged);

        makeDraggable(document.getElementById('zara-tag-container'));
    }

    function renderFriendListSummary(friends, tagged) {
        const containerList = document.getElementById('friendList');
        containerList.innerHTML = '';

        const chunkSize = 100;
        for (let i = 0; i < friends.length; i += chunkSize) {
            const chunk = friends.slice(i, i + chunkSize);
            const alreadyTagged = chunk.filter(f => tagged.includes(f)).length;
            const notTagged = chunk.length - alreadyTagged;

            const div = document.createElement('div');
            div.className = 'friend-chunk';
            div.innerHTML = `
                <label>
                    <input type="checkbox" value="${i}" ${alreadyTagged === chunk.length ? '' : 'checked'}>
                    List ${Math.floor(i / chunkSize) + 1}
                </label>
                <span class="status">Total: ${chunk.length}, Sudah: ${alreadyTagged}, Belum: ${notTagged}</span>
            `;
            containerList.appendChild(div);
        }
    }

    async function dumpFriends() {
        const uid = config.av;
        if (!uid) return alert('UID tidak tersedia di config');

        const dumped = [];
        try {
            const r = await fetch(`${origin}/ajax/typeahead/first_degree.php?dpr=1&__a=1&__af=iw&__be=-1&__pc=PHASED:DEFAULT&__user=${config['av']}&__dyn=7AzHK4HwBgC265Q2m3mbG2KnFw9uu2i5U4e0yqyUdEc88EW3K1uwJxS1Az8bo6u3y4o27w7nCxS320LE36xOfw9q224obEvy8465o-cBwfi12wOKdwGwFyFE-1-y85S5o9kbxSEtwi831wnEaoC9xy48aU8od8-UqwsUkxe2GewGwsoqBwNwKxm5oe8aUavxK3W2i&__req=8&__rev=${config['av']}&fb_dtsg=${config['dtsg']}&jazoest=25667&__spin_r=${config['av']}&__spin_b=trunk&__spin_t=${config['av']}&viewer=${config['av']}&token=0.13495365296964823&filter[0]=user&options[0]=friends_only`, {
                method: 'POST',
                credentials: 'include',
                headers: {}
            });
            const raw_res = await r.text()
            const userids = [...raw_res.matchAll(/"uid":\s*(\d+)/g)]
                .map(m => m[1]);
            dumped.push(...userids);
            await saveFriends(uid, dumped);

        } catch (e) {
            console.log(e)
        }

        document.getElementById('status').innerText = `Teman berhasil di-dump: ${dumped.length}`;
        renderUI();
    }

    async function deleteFriends() {
        const uid = config.av;
        if (!uid) return alert('UID tidak tersedia di config');

        await saveFriends(uid, []);
        await saveTagged(uid, []);
        document.getElementById('status').innerText = `Semua teman dan tag telah dihapus.`;
        renderUI();
    }

    function handlePhotoSelect(event) {
        const file = event.target.files[0];
        if (file) {
            selectedPhotoFile = file;
            
            // Preview image
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('photo-preview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
            
            document.getElementById('status').innerText = `Foto dipilih: ${file.name}`;
        }
    }

    // tag with image and caption
     async function startTagging() {
        const uid = config.av;
        const friends = await getFriends(uid);
        if (friends.length === 0) return alert('Belum ada teman, silahkan dump dulu.');

        // Cek apakah foto sudah dipilih
        if (!selectedPhotoFile) {
            return alert('Silahkan pilih foto terlebih dahulu!');
        }

        const caption = document.getElementById('caption').value;
        const checkedIndexes = Array.from(document.querySelectorAll('#friendList input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.value));

        if (checkedIndexes.length === 0) return alert('Pilih minimal 1 list teman untuk ditag.');

        let alreadyTagged = await getTagged(uid);
        const allToTag = [];

        for (const startIdx of checkedIndexes) {
            const chunk = friends.slice(startIdx, startIdx + 100);
            const toTag = chunk.filter(f => !alreadyTagged.includes(f));
            allToTag.push(...toTag);
        }

        if (allToTag.length === 0) return alert('Semua teman sudah ditag.');

        const loading = document.getElementById('loading-overlay');
        loading.style.display = 'flex';

        try {
            // Upload foto dan tag
            const photoId = await upload_foto(selectedPhotoFile);
            
            if (photoId) {
                await TagwithImg(photoId, allToTag, caption);
                
                alreadyTagged.push(...allToTag);
                await saveTagged(uid, alreadyTagged);
                
                loading.style.display = 'none';
                document.getElementById('status').innerText = `Selesai men-tag ${allToTag.length} teman dengan foto.`;
                renderUI();
            } else {
                loading.style.display = 'none';
                alert('Gagal upload foto. Silahkan coba lagi.');
            }
        } catch (e) {
            loading.style.display = 'none';
            console.error(e);
            alert('Terjadi kesalahan saat tagging.');
        }
    }

    // tag link or caption only
    async function startTaggingonlyLink() {
        const uid = config.av;
        const friends = await getFriends(uid);
        if (friends.length === 0) return alert('Belum ada teman, silahkan dump dulu.');

        const caption = document.getElementById('caption').value;
        const checkedIndexes = Array.from(document.querySelectorAll('#friendList input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.value));

        if (checkedIndexes.length === 0) return alert('Pilih minimal 1 list teman untuk ditag.');

        let alreadyTagged = await getTagged(uid);
        const allToTag = [];

        for (const startIdx of checkedIndexes) {
            const chunk = friends.slice(startIdx, startIdx + 100);
            const toTag = chunk.filter(f => !alreadyTagged.includes(f));
            allToTag.push(...toTag);
        }

        if (allToTag.length === 0) return alert('Semua teman sudah ditag.');

        const loading = document.getElementById('loading-overlay');
        loading.style.display = 'flex';

        // Simulasi API FB call
        await new Promise(r => setTimeout(r, 1000));
        console.log('Tagging ke FB:', allToTag, 'caption:', caption);

        alreadyTagged.push(...allToTag);
        await saveTagged(uid, alreadyTagged);

        loading.style.display = 'none';
        document.getElementById('status').innerText = `Selesai men-tag ${allToTag.length} teman.`;
        renderUI();
    }

    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    async function upload_foto(bfoto) {
        try {
            const config_ = config;
            const form = new FormData();
            form.append('source', '8');
            form.append('profile_id', config_['av']);
            form.append('waterfallxapp', 'comet');
            form.append('farr', bfoto);
            form.append('upload_id', 'jsc_c_b8');

            const resp = await fetch(`https://upload.facebook.com/ajax/react_composer/attachments/photo/upload?av=${config_['av']}&__aaid=0&__user=${config_['av']}&__a=1&__req=50&__hs=${config_['hs']}&dpr=1&__ccg=EXCELLENT&__rev=${config_['sr']}&__s=abkdwv%3Ae3k934%3As36t0f&__hsi=${config_['hsi']}&__dyn=7xeUjGU9k9wxxt0koC8G6Ejh941twWwIxu13wFw_DyUJ3odF8vyUco5S3O2Saxa1NwJwpUe8hw8u2a1sw9u0LVEtwMw6ywIK1Rwwwg8a8462mcw8a1TwgEcEhwGxu782lwj8bU9kbxS2617wnE6a1awhUC7Udo5qfK0zEkxe2GexeeDwkUtxGm2SU4i5oe8cEW4-5pUfEdfwxwhFVovUaUe8ao2mwLyEbUGdG1QwVwwwOg2cwMwhA4UjyUaUbGxeu4Uak0zXxS9wkopg4-6o4e4UO2m3Gfxm2yVU-4FqwIK6E4-mEbUaU2wwgo620XEaUcEK6EqwaW&__csr=gacr4Y5c5sItf2kcn3lhkAbMXsl4NcDkkBsr4jMxrkj4dItEj4SzRbiO_i8PqtFqn8kJPCJqtdEOh5nJmFmDfWp7QSV2VfFipKmZh2O2uBAcZqLJ8YDGBQiGmCWiltHp4W8mGRqfJpfXBmVAAu-nWlul5hpEJJK-pyJ5N2QjBvhFbqQqWKHCDHiKEgUGm-pWCAGrqjGpbBh9agCDpAdyfxaV4F7zBGHztoJurVlVF94uA_XmGAGJ1aAlr-bymQiTJ9ADKr8XDGrKu8BFGGzBFpAjBmAEyXKAurgG9zUB7AACBybKmivym8oB3ubhmeK8lrLhemjzqryuENpu5HBJKhoKFUWoymqG88xmq9-EjzqzriGim2p5xaqaLyqhqyUhyQmuiXXgW9DDxmAcWAJtrng-bBG4WyFEx7yonDK9xha5FHx6KimbyUjAG3eHDxaHV9U-2K5E-EKqiuBgKcBAxmEoLxebUG5FEWq5pqG5Q4o8obaJ2F_Kmjz89U-nBBy98N1a9wKz8bUW5o9o9FGwcSm4EKi2S5E4a0CUgAwDyEa84W3W0PoO2a14wvo8UmCWwAxG4UgK58988GQ3PwrUak2e1jAg4Odx62rxCbzS2N0l8ow8J1au0Ao6yiF40Blo5zK10gfUa9Kihxq9hi398jwQwAyoBK4GCwi86p0Jxmp2-12xeqcgWleUy2qi0zV8gzh05mmcxeu2-4u0QES3O1vw65wIwAwxojgHxG4BOe4Q4EOdwyo8o-c84rp4Uc2u7piFaAFF99ByK5Fkit95yGxLoRDoS3WqU4m8wKhawdGcyptwo8bUcA8wjbQ3658iomLBxHyF83cwOwww7uw6ew4sz80SfgLofo2BwSzE0Ml0be9RAlobiGBlGF5yGQmAE25Gq2eiayUfK0CEGqq4o0J-4FonhEG2e0sa2Uw1Qo8Qq0a1w2s8bE0Gm0D9U28yGm5407rA042jbykcB80jq02KW02iOtoB0i80bqy0199039U3Gweqgw1m8y2vg66mt06twBwb62C8w7uo6abxGA0FP0sE1ji0Aw6Kwdy3yaVlUhK0g229waKgJwsoNwiVo4ta54Ek-48761ixS2C04QUnzS0jq0BpE6G0-Q0o50h81HonxHw7Rw4dxaew40xq8ykby8lwQyx0420e3whia5Uqwt8uy41v8yhoOuEtwYg4Sext5Yx4qqew7Nxq09kQ0oe0VmbhXy8a80mCw1Km0BE4S9wOwoofEnDm5oGchm6GJ04Fwa60r92EfK0xoiwHw4pcUB2U30wcB1m0jq0jK088g0gcIKqE4Z9S1TSq9kpc16G59-egy0XpFD406380IF86q4E0hJxu1Gw&__hsdp=g6azMAzA221kxy3q4haAEe40wgZ0AEIfPAPh4myMgP2FwjnkeMgTNskgA9gjOMi88gIxW48mj9dSpagAikvagoMBlEh5gOYiymktkyb2st4OMyCNF0zr8Gi2W2JmwxE5278O1kgl5E6a114c8Nkgwzez458y8tnsGSOd24l8ytEAy294Ah888g9kMhmHGBENQF24GXGhFJcj6EGn5FhkOLsyVy8xdfARnkF934aX884WqH4D8yCA28wjyWpAh589FFDOOedaNrg_bGG64l8YNaBh38yu9iaRdgAyAyotUGm6VCQqyK8S6AQl6gxaK8yUS9aQqqCzyR69oHHgAxFbBngh8cz45AgEbaihp49mVqhkWGi9gMxa3MR29p8jDF28PwRhUKicoJ0GoG7Qiu5oy7V8jxN34fCgjxpyK4E-UghECjxK6WGh0BhUyawxDyUhqgS9gOE6ycyogg-qpDySEW9gyazsEtDwCgfEG1tx-eBy8GUmg88oHwWmdwNykVx39gG9wKwgUmG1KyXyokgdUjz99UhwNxl0Ey5c6oKEjXw9GpAU98S48G3m5oggiUeFEjwQwCwHDypQ2OUmgxeE9E8Epx27U-3BAQvy5g9EmxSq9zV6JwKwSHXoC2qFUaqxyUszolUzwDAyU-3y1dx3yFoK2hKu7CiAq5E465obUW2K4o4W3q3Guh0gEfo9EG1uBjh8sAw9OiE8o5q1Cwj8kDxu0HosCwUwr8aE6Rox2HKU5G2e1Mx63Gte1ywlUtwl86aE7y58525U2NxG10wQwdqujz8768CU1M87e7A5u18wHxi0h-0QE4S9wTwgEK0w8e89o98gwVxO3-48nwGVUvwFxq58C2a8wh8Ci0yk68fUaUjg2cCwk8iwUCG0EE5N1a2-1EwNyUhz8a8igG2ufDxm0PoCfxq227po2dxe3m2eawXwUwmovBK4oK1rKbCwzxm8g941Rwgoao5iEpwqUbo5B0Ny4222e2G1JU4q2q7bCyo4SE4tG22m1bgcE98ixHwMzUk80yoaEoVUG3l0hEeUfUmwr4q0z86Gmi2aUaU22xm1sxa2W3e7U5OV9o9E4q6UsyK2C2m0K8hyodUswnEG&__hblp=1ufgbEiiEmlwuEhwgo8CcwoUeU6ScxaHxi3uaw8GfwAwvXwzxa2ScK4U8E6C9xGiq2y6A32682XxC2Km2F7_Kex6A1kVovBwZleeyorxqVIw9Ehx24EpUaUWidAxi4ElxeEowxwzxm3m3xafxK265E8K488UswlebwlEswAzUaEbQ1vxu16yoowwy82ZyU-7US6U5jy42G8xS4UhBGq2ueyEvyQ6EgzAudG2S9wFxW8yEepHw-hA5ovzEpwkrwpErw8m3-1UAwKxO5oN16u4ocoaUlzo2ayUc-fVAu2-Ea8d8CdG5oeEqxa18whFU42HGu18wGwqkmF986y48ao8E7u2Sq4UcUrwKwgEhjCxm324e48ozFry8mxu0F8eEhwjE7C18CzEhxm363S48Cbg9F8lxV0pF8S1Jxim6UO2G14UiDGmewwwhoqzotCxmq3y3-EaonghxW9K2idx2dVbxe8Cw-w92Upxi4Uhh8528wnUtwl8dUhxK3Wexm599VUdEG2q2m7E9EC3K6E-8wn9E2-zKeCGEjwkEG8y8d8560GE2ew991nzUjx-i4EjAxi1gKiGxi2Oq6E5K1xU6KEf8gwgorzEnyUW1NwKyoW5E98mwDyUswJxSiql2p89VUvwFAgZ1iVoaufgcUCiq7ouwzyEGVQ5Q263e2u3a1sCzo4a4EnwwCG2i2a2OcwwwyxSax11a2-2O32ayE9EK17x92EdVU2_wwGiim9xq6pHxCGw8N0Eglyo8AVFKbwCxy7U9UmxG7umWzEJ1Cq3CUiyQ5EycBF0AgqwmE9UpwFwFxScG5bxWi17gS6Hg5B0NhQ48CnwxG4EgK3e5EnyK2m222q9kwOXxK3Cu2au7FA6Am11y65ErK4HyoiGby-awRzFi0mEmAzWwGxzDyEyp0Bzo5C6E8otwpothE9Ea8kwDwRwQBAyWhEKUaXwoUSczFBx232q4e4byEkyF8bHyU9ovxeeDABDCxui4EhxO3y8a2C2m3Hw_KE9UO4o46Uoxq4k224UHw&__sjsp=g6azMAzA221kxy3q4haAEe40wgZ0y4EIfPAPh4myOgRP14fRtR6gx13v5Nh2n7gjOMi88gIxW48hhcATpAF2h9y8h8kgXb6lWeydJ5xr8mCszbjJ4CxJeGoG5p65dyqK84pyBhRAIUTxOi9PfwDP4hA4dzxgIU8Qycq8jgK4WioSl48t994iy6Q8hr8CAX8wyh95IuPyqc4KFGht16axG9z2AjnPWi4OqBswJ5pF8gyV31e2p78O39455ubJ38jHG9D84A58_aa65CoC25yV22UizEc88CeKfg9Ap3U4xwWg8A5y0qQ2B5g1g62F4whEoxN34fCgaC0E41IxV91t0a21ig4m2V0cuewQg7CE0B65k060u04eUF4w&__comet_req=15&fb_dtsg=${config_['dtsg']}&jazoest=25594&lsd=${config_['lsd']}&__spin_r=${config_['sr']}&__spin_b=trunk&__spin_t=${config_['st']}&__crn=comet.fbweb.CometHomeRoute`, {
                method: 'POST',
                credentials: 'include',
                headers: {},
                body: form
            });

            const rawtext = await resp.text()
            const foto_id = rawtext.match(/"photoID":"(\d+)"/)[1]
            return foto_id

        } catch (e) {
            console.log('uperror',e)
            return null
        }
    }

    // post tag image
    async function TagwithImg(fotomu,tagsid,caption) {
        try {
            const Idfoto = fotomu
            const idem = generateUUIDv4();
            const requ = await fetch(`${origin}/api/graphql/`, {
                method: 'POST',
                credentials:'include',
                headers: {
                    'x-asbd-id': '359341',
                    'x-fb-friendly-name': 'ComposerStoryCreateMutation',
                    'x-fb-lsd': config['lsd'],
                },
                body: new URLSearchParams({
                    'av': config['av'],
                    '__aaid': '0',
                    '__user': config['av'],
                    '__a': '1',
                    '__req': '19',
                    '__hs': config['hs'],
                    'dpr': '1',
                    '__ccg': 'EXCELLENT',
                    '__rev': config['sr'],
                    '__s': 'btuc0v:0mj6om:tb3zlj',
                    '__hsi': '7580643212180508305',
                    '__dyn': '7xeUjGU5a5Q1ryaxG4Vp41twWwIxu13wFwhUKbgS3q2ibwNwnof8boG0x8bo6u3y4o2Gwn82nwb-q7oc81EEbbwto886C11wBz83WwgEcEhwGxu782lwv89kbxS1FwnE6a1awhUC7Udo5qfK0zEkxe2GewyDwkUe9obrwh8lwUwOzEjUlDw-wUwxwjFovUaU6a0BEbUG2-azqwt8eo88cA0z8c84q58jyUaUbGxeu4Uak0zU8oC1hxB0jUpwgUjz89oeE-5oabDzUiBG2OUqwjVqwLwHwa211wo83KwHwOyUqxG0K8',
                    '__csr': 'geA5kl9fawggxkaPsA4dh23smB6tT4NIP9btTJtiXdtOWXbOtaICBbh9lqikOThcWqtFeBJrQ-B8FkShbmkAwSitqlm_iVGAoWKp6FkGimimKinJdfpH_BgDSUiqh5hpl-lBVG8a-TJTF5G4qCz8CuVkAczk_BpaiGt4DhZ5-BmmQ4HzppuF8Kazo89VrADx6qbxafDCykFaxzhoDAgy-EN5ByWzbGdixhV94UyayUyHyVoJ3VQuuXUaoR6GdxOijzoC6kcWx2rzkUTAKmVA6UPwCyV8W4UyUiU8UpzKii2arUybCBDzGDyHVrx7zo-urwPh8y3K48F3o-q16DKEC-bx6ujwMx68xeq5ECQ3qEGUiK5UuyEgGi1ymdK8yJaeGqUlBwOwr8N11243a6U-13wIzVEsG1axOiEaoow860N8621pwppE5e0_o1cS0PU4O9wk998DyQ6O0i9Bw7Sw3sQ0OXg420C83nxa1ux236588e1kxefBkEco1Xdwqogxi2-0apweG2W1xxui7U5DwQwd1Axq2-04YE1VXw0Q9o26w6Wwko0AS02dLnz802m9g04420wFC0eAo1zm0pK1EK0fNw2e80zq0ti07BQ08_w21E7i0ie0lO8gKt1ZwQwvU4-u0aMzN8rw8622pwt81BU19U6e09e81Eo1hVi1qq0aTwp8dE6-Eykw0sWyU1Uo5S1ezV808fOu0Cm0mq5uQyl9wGgaSoPWh7U1s-gw0CG020m0bYxa0E9U1Xyw',
                    '__hsdp': 'g54wg8WF6GwXeodA1wy9EdA1Kxit8mgv4MiE98ihPB5Mx1d1d4UhfMgEAr64sh26o4Y5cPEePSBeAAzaaC13L6l6T5Cax3h6icjd2WiA8jA8RGCP9OcuNXEW5A2afcF5yb4Ex6yt8RH5QxSACqwOzQVmzc5tNhpOIpSx24hYikkupbaW2ckp8WX8ASQQmiWaAuQSAirpgQXAza6VF3VomlappXhGGmKFaJr5t2520yxuuiGFlzqK4FVBAcA8ypqAx8_FhFqEyGmmdpDWYUCaKc8-4KfpRjV8ygopOsMOuAAqzxubQdBeqU5K4O6BG21GnCoW7EkDc2m5yzEjgDwTxa5E9QAC7okAhUS6VQbDx6uKF7QwXxqajw_xW3uiFUiwmUN0mUmg-4XKh3omxOdxu3a3fG4ECfw8LCgWh1XzEO3J1OaVEaEgkwhAg7a1wGbx7giwyw78whp8gxa784wVoaUeC6E2lzQ1Twbu2e17wl9ponzawik8zqyUl9wwwoEmxF5AwKwn8C0J8898f8cpQEqwvEG5UgweN1O2y0BEH-8xqq16wKxmibG2O1nw8x0sE8U21xO1GwIw8O3e0su0I829xO2608qwt86-0ou0Yo1yUgwfa0h-15wnU5i3K0iC1kwb62Ku6E3jwb219wuouwYwio3LwFwmof8rwno6q1qw6dwGAw3XE2py80xCu0-80Da0Z81JU5C481aU9U1r8',
                    '__hblp': '1ufgbEimNpm1fwFwkoS7U4lwbW4kh0GxC0RpU7-fwBwOxl0LwoUcWCwoo2_wHxq3Sm7k8_y8C5WAwk8mz843-EhyU468ylpKEqwBx69Awg8lDyE-8z9F8a8vw8S2-68y4ojwJUco2CxK1FxG5ojy83kG3C7o5K1uGu5U8VU4udwiK36i4ECfwrby8rGbwAXxu3K7oGi1nAwsU9AA3i2a3y1Dw8SbzU2NG15K0yU198Zd0qF83uwhUSU6qawJwGx227m08nwGwnEK1kwpUOU4u0Fo35wt88o4F0wxu68W2-bwv8e8eK2u3m262e789oqwFwIwv8-3-220GE4e1fweq2m1ux-axO48gwauqaxy2G4U88fQ8hUlDwookwt86V0gEvwIwZwaq4Egw9q19woo2GwvEgxXonwgopwCwQwjUW1tK1uwhpE56qu15Cx62C12wkE2jwNxGu58uwDwl648pDx29wSxO2i1qwDwwxS14WwiqxzAU5i7EcoG19xK14yo98gwjErzo4Waxi2lxKm3q221kAyQ2y361hw4WiVovADy99UKbx23a1axKq0iu8gswl9udwMx61iy85e5FDxG78kxi1hx64K2y2G53o6m2S1jyETxG3-aCwJyQq3u5p89bxW3-7o0C-Ea9ElwaW4UN08fwVx-1fxO2K7e2p0BVUgwbe5XxC48SaAxa6t2EcUrwdKdwOx-uu',
                    '__sjsp': 'g54wg8WF6GwXeodA1wy9cdA1Kxit8mgv4NW2z2ap4hPBd9kr1d2Yj94UhfMgEAr64shf4pyMgN_2YNYY9jSYWiicEhkIn65NyPjkzi7mymihAz93l2yKp4y46QUx0xockEvyQCEN0yUkw828zk9geFEaE8oGQmeg-hd2XCd2hUhEoFEixpoc8nxp1Qk4qBg2Bwyg4vxa3egoqezo0irg1g83NU37w1YK0eIw1p2',
                    '__comet_req': '15',
                    'locale': 'id_ID',
                    'fb_dtsg': config['dtsg'],
                    'jazoest': '25209',
                    'lsd': config['lsd'],
                    '__spin_r': config['sr'],
                    '__spin_b': 'trunk',
                    '__spin_t': config['st'],
                    '__crn': 'comet.fbweb.CometHomeRoute',
                    'fb_api_caller_class': 'RelayModern',
                    'fb_api_req_friendly_name': 'ComposerStoryCreateMutation',
                    'server_timestamps': 'true',
                    'variables': JSON.stringify({"input":{"composer_entry_point":"inline_composer","composer_source_surface":"newsfeed","composer_type":"feed","idempotence_token":`${idem}_FEED`,"source":"WWW","audience":{"privacy":{"allow":[],"base_state":"EVERYONE","deny":[],"tag_expansion_state":"UNSPECIFIED"}},"message":{"ranges":[],"text":caption},"inline_activities":[],"text_format_preset_id":"0","publishing_flow":{"supported_flows":["ASYNC_SILENT","ASYNC_NOTIF","FALLBACK"]},"attachments":[{"photo":{"id":Idfoto}}],"with_tags_ids":tagsid,"logging":{"composer_session_id":idem},"navigation_data":{"attribution_id_v2":"CometHomeRoot.react,comet.home,via_cold_start,1765006038204,904798,4748854339,,"},"tracking":[null],"event_share_metadata":{"surface":"newsfeed"},"actor_id":config['av'],"client_mutation_id":"1"},"feedLocation":"NEWSFEED","feedbackSource":1,"focusCommentID":null,"gridMediaWidth":null,"groupID":null,"scale":1,"privacySelectorRenderLocation":"COMET_STREAM","checkPhotosToReelsUpsellEligibility":true,"renderLocation":"homepage_stream","useDefaultActor":false,"inviteShortLinkKey":null,"isFeed":true,"isFundraiser":false,"isFunFactPost":false,"isGroup":false,"isEvent":false,"isTimeline":false,"isSocialLearning":false,"isPageNewsFeed":false,"isProfileReviews":false,"isWorkSharedDraft":false,"hashtag":null,"canUserManageOffers":false,"__relay_internal__pv__CometUFIShareActionMigrationrelayprovider":true,"__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider":true,"__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider":true,"__relay_internal__pv__CometUFI_dedicated_comment_routable_dialog_gkrelayprovider":false,"__relay_internal__pv__CometUFICommentAvatarStickerAnimatedImagerelayprovider":false,"__relay_internal__pv__IsWorkUserrelayprovider":false,"__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider":false,"__relay_internal__pv__TestPilotShouldIncludeDemoAdUseCaserelayprovider":false,"__relay_internal__pv__FBReels_deprecate_short_form_video_context_gkrelayprovider":true,"__relay_internal__pv__FeedDeepDiveTopicPillThreadViewEnabledrelayprovider":false,"__relay_internal__pv__FBReels_enable_view_dubbed_audio_type_gkrelayprovider":true,"__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider":false,"__relay_internal__pv__WorkCometIsEmployeeGKProviderrelayprovider":false,"__relay_internal__pv__IsMergQAPollsrelayprovider":false,"__relay_internal__pv__FBReels_enable_meta_ai_label_gkrelayprovider":true,"__relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider":true,"__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider":true,"__relay_internal__pv__FBReelsIFUTileContent_reelsIFUPlayOnHoverrelayprovider":true,"__relay_internal__pv__GroupsCometGYSJFeedItemHeightrelayprovider":206,"__relay_internal__pv__StoriesShouldIncludeFbNotesrelayprovider":false,"__relay_internal__pv__GHLShouldChangeSponsoredAuctionDistanceFieldNamerelayprovider":true,"__relay_internal__pv__GHLShouldUseSponsoredAuctionLabelFieldNameV1relayprovider":true,"__relay_internal__pv__GHLShouldUseSponsoredAuctionLabelFieldNameV2relayprovider":false}),
                    'doc_id': '25306684598942431'
                })
            });

            const respone = await requ.text()
            console.log(respone)

        } catch (e) {
            console.log(e)
        }

    };

    function makeDraggable(el) {
        const header = document.getElementById('zara-tag-header');
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDrag;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            el.style.top = (el.offsetTop - posY) + "px";
            el.style.left = (el.offsetLeft - posX) + "px";
        }

        function closeDrag() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    renderUI();
}
