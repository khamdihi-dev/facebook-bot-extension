export function FBPost(menuContainer, config_) {
    // Remove old panel if exists
    const origin =  window.location.origin
    const old = document.getElementById('fb-post-container');
    if (old) old.remove();

    // ==== CREATE BOX ====
    const box = document.createElement('div');
    box.id = 'fb-post-container';
    box.style.position = 'fixed';
    box.style.width = '320px';
    box.style.background = '#fff';
    box.style.borderRadius = '16px';
    box.style.padding = '16px';
    box.style.boxShadow = '0 12px 48px rgba(0,0,0,0.2)';
    box.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    box.style.zIndex = 999999;
    box.style.userSelect = 'none';

    // Position beside menu
    const rect = menuContainer.getBoundingClientRect();
    box.style.top = (rect.top + window.scrollY) + 'px';
    box.style.left = (rect.right + 10) + 'px';

    // ==== HEADER (DRAG) ====
    const header = document.createElement('div');
    header.style.cursor = 'grab';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.style.marginBottom = '16px';
    header.style.fontSize = '16px';
    header.style.fontWeight = '600';
    header.style.color = '#c06c84';
    header.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff6b9d">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Posting
    `;
    box.appendChild(header);

    // ==== IMAGE UPLOAD INPUT ====
    const uploadWrap = document.createElement('div');
    uploadWrap.style.marginBottom = '12px';

    const imgInput = document.createElement('input');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.multiple = false;
    imgInput.style.display = 'none';

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = '📷 Pilih Gambar';
    uploadBtn.style.width = '100%';
    uploadBtn.style.padding = '10px';
    uploadBtn.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)';
    uploadBtn.style.color = 'white';
    uploadBtn.style.border = 'none';
    uploadBtn.style.borderRadius = '8px';
    uploadBtn.style.cursor = 'pointer';
    uploadBtn.style.fontSize = '14px';
    uploadBtn.style.fontWeight = '500';
    uploadBtn.style.transition = 'transform 0.2s';

    uploadBtn.onmouseover = () => uploadBtn.style.transform = 'scale(1.02)';
    uploadBtn.onmouseout = () => uploadBtn.style.transform = 'scale(1)';
    uploadBtn.onclick = () => imgInput.click();

    uploadWrap.appendChild(imgInput);
    uploadWrap.appendChild(uploadBtn);
    box.appendChild(uploadWrap);

    // ==== IMAGE PREVIEW ====
    const imgPreview = document.createElement('img');
    imgPreview.style.width = '100%';
    imgPreview.style.maxHeight = '180px';
    imgPreview.style.objectFit = 'cover';
    imgPreview.style.borderRadius = '8px';
    imgPreview.style.display = 'none';
    imgPreview.style.marginBottom = '12px';
    box.appendChild(imgPreview);

    imgInput.addEventListener('change', () => {
        const file = imgInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
                uploadBtn.textContent = '✓ Gambar dipilih';
            };
            reader.readAsDataURL(file);
        } else {
            imgPreview.style.display = 'none';
            uploadBtn.textContent = '📷 Pilih Gambar';
        }
    });

    // ==== CAPTION INPUT ====
    const caption = document.createElement('textarea');
    caption.placeholder = 'Masukkan caption...';
    caption.style.width = '100%';
    caption.style.height = '70px';
    caption.style.padding = '10px';
    caption.style.borderRadius = '8px';
    caption.style.border = '1px solid #e0e0e0';
    caption.style.resize = 'vertical';
    caption.style.marginBottom = '12px';
    caption.style.fontSize = '14px';
    caption.style.fontFamily = 'inherit';
    box.appendChild(caption);

    // ==== LOG CONTAINER ====
    const logBox = document.createElement('div');
    logBox.style.display = 'none';
    logBox.style.padding = '10px';
    logBox.style.borderRadius = '8px';
    logBox.style.marginBottom = '12px';
    logBox.style.fontSize = '13px';
    logBox.style.fontWeight = '500';
    box.appendChild(logBox);

    // ==== BUTTONS ====
    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '8px';

    const btnPost = document.createElement('button');
    btnPost.textContent = 'Post';
    btnPost.style.flex = '1';
    btnPost.style.padding = '10px';
    btnPost.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)';
    btnPost.style.color = 'white';
    btnPost.style.border = 'none';
    btnPost.style.borderRadius = '8px';
    btnPost.style.cursor = 'pointer';
    btnPost.style.fontSize = '14px';
    btnPost.style.fontWeight = '600';
    btnPost.style.transition = 'transform 0.2s';

    const btnBack = document.createElement('button');
    btnBack.textContent = 'Back';
    btnBack.style.flex = '1';
    btnBack.style.padding = '10px';
    btnBack.style.background = '#6c757d';
    btnBack.style.color = 'white';
    btnBack.style.border = 'none';
    btnBack.style.borderRadius = '8px';
    btnBack.style.cursor = 'pointer';
    btnBack.style.fontSize = '14px';
    btnBack.style.fontWeight = '600';
    btnBack.style.transition = 'transform 0.2s';

    btnPost.onmouseover = () => btnPost.style.transform = 'scale(1.02)';
    btnPost.onmouseout = () => btnPost.style.transform = 'scale(1)';
    btnBack.onmouseover = () => btnBack.style.transform = 'scale(1.02)';
    btnBack.onmouseout = () => btnBack.style.transform = 'scale(1)';

    btnWrap.appendChild(btnPost);
    btnWrap.appendChild(btnBack);
    box.appendChild(btnWrap);

    document.body.appendChild(box);

    // ==== LOG HELPER ====
    function showLog(message, type = 'info') {
        logBox.style.display = 'block';
        logBox.textContent = message;

        if (type === 'success') {
            logBox.style.background = '#d4edda';
            logBox.style.color = '#155724';
            logBox.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            logBox.style.background = '#f8d7da';
            logBox.style.color = '#721c24';
            logBox.style.border = '1px solid #f5c6cb';
        } else {
            logBox.style.background = '#d1ecf1';
            logBox.style.color = '#0c5460';
            logBox.style.border = '1px solid #bee5eb';
        }
    }

    function hideLog() {
        logBox.style.display = 'none';
    }

    async function upload_foto(bfoto) {
        try {
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
            return null
        }
    }

    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async function postToAPI(idfoto, captionText) {
        try {
            const idem = generateUUIDv4();
            const resp = await fetch(`${origin}/api/graphql/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'x-asbd-id': '359341',
                    'x-fb-friendly-name': 'ComposerStoryCreateMutation',
                    'x-fb-lsd': config_['lsd'],
                },
                body: new URLSearchParams({
                    'av': config_['av'],
                    '__aaid': '0',
                    '__user': config_['av'],
                    '__a': '1',
                    '__req': '57',
                    '__hs': config_['hs'],
                    'dpr': '1',
                    '__ccg': 'EXCELLENT',
                    '__rev': config_['sr'],
                    '__s': 'abkdwv:e3k934:s36t0f',
                    '__hsi': config_['hsi'],
                    '__dyn': '7xeUjGU9k9wxxt0koC8G6Ejh941twWwIxu13wFw_DyUJ3odF8vyUco5S3O2Saxa1NwJwpUe8hw8u2a1sw9u0LVEtwMw6ywIK1Rwwwg8a8462mcw8a1TwgEcEhwGxu782lwj8bU9kbxS2617wnE6a1awhUC7Udo5qfK0zEkxe2GexeeDwkUtxGm2SU4i5oe8cEW4-5pUfEdfwxwhFVovUaUe8ao2mwLyEbUGdG1QwVwwwOg2cwMwhA4UjyUaUbGxeu4Uak0zXxS9wkopg4-6o4e4UO2m3Gfxm2yVU-4FqwIK6E4-mEbUaU2wwgo620XEaUcEK6EqwaW',
                    '__csr': 'gacr4Y5c5sItf2kcn3lhkAbMXsl4NcDkkBsr4jMxrkj4dItEj4SzRbiO_i8PqtFqn8kJPCJqtdEOh5nJmFmDfWp7QSV2VfFipKmZh2O2uBAcZqLJ8YDGBQiGmCWiltHp4W8mGRqfJpf_BmVAAu-nWlul5hpEJJK-pyJ5N2QjBvhFbqQqWKHCDHiKEgUGm-pWCAGrqjGpbBh9agCDpAdyfxaV4F7zBGHztoJurVlVF94uA_XmGAGJ1aAlr-bymQiTJ9ADKr8XDGrKu8BFGGzBFpAjBmAEyXKAurgG9zUB7AACBybKmivym8oB3ubhmeK8lrLhemjzqryuENpu5HBJKhoKFUWoymqG88xmq9-EjzqzriGim2p5xaqaLyqhqyUhyQmuiXXgW9DDxmAcWAJtrng-bBG4WyFEx7yonDK9xha5FHx6KimbyUjAG3eHDxaHV9U-2K5E-EKqiuBgKcBAxmEoLxebUG5FEWq5pqG5Q4o8obaJ2F_Kmjz89U-nBBy98N1a9wKz8bUW5o9o9FGwcSm4EKi2S5E4a0CUgAwDyEa84W3W0PoO2a14wvo8UmCWwAxG4UgK58988GQ3PwrUak2e1jAg4Odx62rxCbzS2N0l8ow8J1au0Ao6yiF40Blo5zK10gfUa9Kihxq9hi398jwQwAyoBK4GCwi86p0Jxmp2-12xeqcgWleUy2qi0zV8gzh05mmcxeu2-4u0QES3O1vw65wIwAwxojgHxG4BOe4Q4EOdwyo8o-c84rp4Uc2u7piFaAFF99ByK5Fkit95yGxLoRDoS3WqU4m8wKhawdGcyptwo8bUcA8wjbQ3658iomLBxHyF83cwOwww7uw6ew4sz80SfgLofo2BwSzE0Ml0be9RAlobiGBlGF5yGQmAE25Gq2eiayUfK0CEGqq4o0J-4FonhEG2e0sa2Uw1Qo8Qq0a1w2s8bE0Gm0D9U28yGm5407rA042jbykcB80jq02KW02iOtoB0i80bqy0199039U3Gweqgw1m8y2vg66mt06twBwb62C8w7uo6abxGA0FP0sE1ji0Aw6Kwdy3yaVlUhK0g229waKgJwsoNwiVo4ta54Ek-48761ixS2C04QUnzS0jq0BpE6G0-Q0o50h81HonxHw7Rw4dxaew40xq8ykby8lwQyx0420e3whia5Uqwt8uy41v8yhoOuEtwYg4Sext5Yx4qqew7Nxq09kQ0oe0VmbhXy8a80mCw1Km0BE4S9wOwoofEnDm5oGchm6GJ04Fwa60r92EfK0xoiwHw4pcUB2U30wcB1m0jq0jK088g0gcIKqE4Z9S1TSq9kpc16G59-egy0XpFD406380IF86q4E0hJxu1Gw',
                    '__hsdp': 'g6azMAzA221kxy3q4haAEe40wgZ0AEIfPAPh4myMgP2FwjnkeMgTNskgA9gjOMi88gIxW48mj9dSpagAikvagoMBlEh5gOYiymktkyb2st4OMyCNF0zr8Gi2W2JmwxE5278O1kgl5E6a114c8Nkgwzez458y8tnsGSOd24l8ytEAy294Ah888g9kMhmHGBENQF24GXGhFJcj6EGn5FhkOLsyVy8xdfARnkF934aX884WqH4D8yCA28wjyWpAh589FFDOOedaNrg_bGG64l8YNaBh38yu9iaRdgAyAyotUGm6VCQqyK8S6AQl6gxaK8yUS9aQqqCzyR69oHHgAxFbBngh8cz45AgEbaihp49mVqhkWGi9gMxa3MR29p8jDF28PwRhUKicoJ0GoG7Qiu5oy7V8jDgjgN3VA4UmoHxafK44q9AUrxKGAg9ku8yE8pUK4mAdykcG1pgScyogg-qpDySEW9gyazsEtDwCgfEG1tx-eBy8GUmg88oHwWmdwNykVx39gG9wKwgUmG1KyXyokgdUjz99UhwNxl0Ey5c6oKEjXw9GpAU98S48G3m5oggiUeFEjwQwCwHDypQ2OUmgxeE9E8Epx27U-3BAQvy5g9EmxSq9zV6JwKwSHXoC2qFUaqxyUszolUzwDAyU-3y1dx3yFoK2hKu7CiAq5E465obUW2K4o4W3q3Guh0gEfo9EG1uBjh8sAw9OiE8o5q1Cwj8kDxu0HosCwUwr8aE6Rox2HKU5G2e1Mx63Gte1ywlUtwl86aE7y58525U2NxG10wQwdqujz8768CU1M87e7A5u18wHxi0h-0QE4S9wTwgEK0w8e89o98gwVxO3-48nwGVUvwFxq58C2a8wh8Ci0yk68fUaUjg2cCwk8iwUCG0EE5N1a2-1EwNyUhz8a8igG2ufDxm0PoCfxq227po2dxe3m2eawXwUwmovBK4oK1rKbCwzxm8g941Rwgoao5iEpwqUbo5B0Ny4222e2G1JU4q2q7bCyo4SE4tG22m1bgcE98ixHwMzUk80yoaEoVUG3l0hEeUfUmwr4q0z86Gmi2aUaU22xm1sxa2W3e7U5OV9o9E4q6UsyK2C2m0K8hyodUswnEG',
                    '__hblp': '1ufgbEiiEmlwuEhwgo8CcwoUeU6ScxaHxi3uaw8GfwAwvXwzxa2ScK4U8E6C9xGiq2y6A32682XxC2Km2F7_Kex6A1kVovBwZleeyorxqVIw9Ehx24EpUaUWidAxi4ElxeEowxwzxm3m3xafxK265E8K488UswlebwlEswAzUaEbQ1vxu16yoowwy82ZyU-7US6U5jy42G8xS4UhBGq2ueyEvyQ6EgzAudG2S9wFxW8yEepHw-hA5ovzEpwkrwpErw8m3-1UAwKxO5oN16u4ocoaUlzo2ayUc-fVAu2-Ea8d8CdG5oeEqxa18whFU42HGu18wGwqkmF986y48ao8E7u2Sq4UcUrwKwgEhjCxm324e48ozFry8mxu0F8eEhwjE7C18CzEhxm363S48Cbg9F8lxV0pF8S1Jxim6UO2G14UiDGmewwwhoqzotCxmq3y3-EaonghxW9K2idx2dVbxe8Cw-w92Upxi4Uhh8528wnUtwl8dUhxK3Wexm599VUdEG2q2m7E9EC3K6E-8wn9E2-zKeCGEjwkEG8y8d8560GE2ew991nzUjx-i4EjAxi1gKiGxi2Oq6E5K1xU6KEf8gwgorzEnyUW1NwKyoW5E98mwDyUswJxSiql2p89VUvwFAgZ1iVoaufgcUCiq7ouwzyEGVQ5Q263e2u3a1sCzo4a4EnwwCG2i2a2OcwwwyxSax11a2-2O32ayE9EK17x92EdVU2_wwGiim9xq6pHxCGw8N0Eglyo8AVFKbwCxy7U9UmxG7umWzEJ1Cq3CUiyQ5EycBF0AgqwmE9UpwFwFxScG5bxWi17gS6Hg5B0NhQ48CnwxG4EgK3e5EnyK2m222q9kwOXxK3Cu2au7FA6Am11y65ErK4HyoiGby-awRzFi0mEmAzWwGxzDyEyp0Bzo5C6E8otwpothE9Ea8kwDwRwQBAyWhEKUaXwoUSczFBx232q4e4byEkyF8bHyU9ovxeeDABDCxui4EhxO3y8a2C2m3Hw_KE9UO4o46Uoxq4k224UHw',
                    '__sjsp': 'g6azMAzA221kxy3q4haAEe40wgZ0y4EIfPAPh4myOgRP14fRtR6gx13v5Nh2n7gjOMi88gIxW48hhcATpAF2h9y8h8kgXb6lWeydJ5xr8mCszbjJ4CxJeGoG5p65dyqK84pyBhRAIUTxOi9PfwDP4hA4dzxgIU8Qycq8jgK4WioSl48t994iy6Q8hr8CAX8wyh95IuPyqc4KFGht16axG9z2AjnPWi4OqBswJ5pF8gyV31e2p78O39455ubJ38jHG9D84A58_aa65CoC25yV22UizEc88CeKfg9Ap3U4xwWg8A5y0qQ2B5g1g62F4whEoDgjgN3VA2Fwa10r8uigng6B0RwkA15wKg37zEd41VG09hxl01w7w13Kah8',
                    '__comet_req': '15',
                    'fb_dtsg': config_['dtsg'],
                    'jazoest': '25594',
                    'lsd': config_['lsd'],
                    '__spin_r': config_['sr'],
                    '__spin_b': 'trunk',
                    '__spin_t': config_['st'],
                    '__crn': 'comet.fbweb.CometHomeRoute',
                    'fb_api_caller_class': 'RelayModern',
                    'fb_api_req_friendly_name': 'ComposerStoryCreateMutation',
                    'server_timestamps': 'true',
                    'variables': JSON.stringify({ "input": { "composer_entry_point": "inline_composer", "composer_source_surface": "newsfeed", "composer_type": "feed", "idempotence_token": `${idem}_FEED`, "source": "WWW", "audience": { "privacy": { "allow": [], "base_state": "EVERYONE", "deny": [], "tag_expansion_state": "UNSPECIFIED" } }, "message": { "ranges": [], "text": captionText }, "inline_activities": [], "text_format_preset_id": "0", "publishing_flow": { "supported_flows": ["ASYNC_SILENT", "ASYNC_NOTIF", "FALLBACK"] }, "attachments": [{ "photo": { "id": idfoto } }], "logging": { "composer_session_id": idem }, "navigation_data": { "attribution_id_v2": "CometHomeRoot.react,comet.home,tap_tabbar,1764954376439,815336,4748854339,," }, "tracking": [null], "event_share_metadata": { "surface": "newsfeed" }, "actor_id": config_['av'], "client_mutation_id": "16" }, "feedLocation": "NEWSFEED", "feedbackSource": 1, "focusCommentID": null, "gridMediaWidth": null, "groupID": null, "scale": 1, "privacySelectorRenderLocation": "COMET_STREAM", "checkPhotosToReelsUpsellEligibility": true, "renderLocation": "homepage_stream", "useDefaultActor": false, "inviteShortLinkKey": null, "isFeed": true, "isFundraiser": false, "isFunFactPost": false, "isGroup": false, "isEvent": false, "isTimeline": false, "isSocialLearning": false, "isPageNewsFeed": false, "isProfileReviews": false, "isWorkSharedDraft": false, "hashtag": null, "canUserManageOffers": false, "__relay_internal__pv__CometUFIShareActionMigrationrelayprovider": true, "__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider": true, "__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider": true, "__relay_internal__pv__CometUFI_dedicated_comment_routable_dialog_gkrelayprovider": false, "__relay_internal__pv__CometUFICommentAvatarStickerAnimatedImagerelayprovider": false, "__relay_internal__pv__IsWorkUserrelayprovider": false, "__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider": false, "__relay_internal__pv__TestPilotShouldIncludeDemoAdUseCaserelayprovider": false, "__relay_internal__pv__FBReels_deprecate_short_form_video_context_gkrelayprovider": true, "__relay_internal__pv__FeedDeepDiveTopicPillThreadViewEnabledrelayprovider": false, "__relay_internal__pv__FBReels_enable_view_dubbed_audio_type_gkrelayprovider": true, "__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider": false, "__relay_internal__pv__WorkCometIsEmployeeGKProviderrelayprovider": false, "__relay_internal__pv__IsMergQAPollsrelayprovider": false, "__relay_internal__pv__FBReels_enable_meta_ai_label_gkrelayprovider": true, "__relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider": true, "__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider": true, "__relay_internal__pv__FBReelsIFUTileContent_reelsIFUPlayOnHoverrelayprovider": true, "__relay_internal__pv__GroupsCometGYSJFeedItemHeightrelayprovider": 206, "__relay_internal__pv__StoriesShouldIncludeFbNotesrelayprovider": false, "__relay_internal__pv__GHLShouldChangeSponsoredAuctionDistanceFieldNamerelayprovider": false, "__relay_internal__pv__GHLShouldUseSponsoredAuctionLabelFieldNameV1relayprovider": false, "__relay_internal__pv__GHLShouldUseSponsoredAuctionLabelFieldNameV2relayprovider": false }),
                    'doc_id': '25171307619195097'
                })
            });
            const parse = await resp.json()
            const success = parse.data.story_create.story.url;
            if (success) {
                return { success: true, message: '✓ Posting berhasil!' };
            } else {
                return { success: false, message: '✗ Gagal posting, coba lagi!' };
            }

        } catch (e) {
            console.log(e)
        }
    }

    // ==== BUTTON LOGIC ====
    btnBack.onclick = () => box.remove();

    btnPost.onclick = async () => {
        if (!imgInput.files[0]) {
            showLog('⚠ Pilih gambar terlebih dahulu!', 'error');
            return;
        }

        btnPost.disabled = true;
        btnPost.textContent = 'Posting...';
        hideLog();

        try {
            const up_img = await upload_foto(imgInput.files[0]);
            const result = await postToAPI(up_img, caption.value);

            if (result.success) {
                showLog(result.message, 'success');
                setTimeout(() => box.remove(), 2000);
            } else {
                showLog(result.message, 'error');
            }
        } catch (error) {
            showLog('✗ Terjadi kesalahan: ' + error.message, 'error');
        } finally {
            btnPost.disabled = false;
            btnPost.textContent = 'Post';
        }
    };

    // ==== DRAG SYSTEM ====
    let dragging = false, startX, startY, origX, origY;

    header.addEventListener('mousedown', (e) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const r = box.getBoundingClientRect();
        origX = r.left;
        origY = r.top;

        header.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        box.style.left = origX + dx + 'px';
        box.style.top = origY + dy + 'px';
    });

    document.addEventListener('mouseup', () => {
        dragging = false;
        header.style.cursor = 'grab';
    });
}