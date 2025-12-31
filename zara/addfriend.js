export function FBaddFriend(menuContainer, config_) {

    // Remove existing panel
    const origin = window.location.origin;
    const old = document.getElementById('fb-addfriend-container');
    if (old) old.remove();

    // ==== PANEL CONTAINER ====
    const box = document.createElement('div');
    box.id = 'fb-addfriend-container';
    Object.assign(box.style, {
        position: 'fixed',
        width: '340px',
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        zIndex: 999999,
        userSelect: 'none'
    });

    // Position panel next to main menu
    const rect = menuContainer.getBoundingClientRect();
    box.style.top = (rect.top + window.scrollY) + 'px';
    box.style.left = (rect.right + 12) + 'px';

    // ==== HEADER (DRAG) ====
    const header = document.createElement('div');
    Object.assign(header.style, {
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        fontSize: '17px',
        fontWeight: '600',
        color: '#c06c84'
    });

    header.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff6b9d">
      <path d="M15 12h-3v3h-2v-3H7v-2h3V7h2v3h3v2z"></path>
    </svg>
    Add Teman
  `;
    box.appendChild(header);

    // ==== TEXTAREA ====
    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, {
        width: '100%',
        height: '100px',
        padding: '10px 12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        resize: 'vertical',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        overflowY: 'auto'
    });
    textarea.placeholder = "Masukkan ID/link teman (1 baris = 1 teman)";
    box.appendChild(textarea);

    box.appendChild(document.createElement('br'));
    box.appendChild(document.createElement('br'));

    // ==== DELAY INPUT ====
    const delayWrap = document.createElement('div');
    delayWrap.style.marginBottom = '6px';

    delayWrap.innerHTML = `<span style="font-size:14px;">Delay per Add (detik):</span>`;
    box.appendChild(delayWrap);

    const delayInput = document.createElement('input');
    Object.assign(delayInput.style, {
        width: '70px',
        marginLeft: '6px',
        fontSize: '14px',
        padding: '3px',
        border: '1px solid #e0e0e0',
        borderRadius: '5px'
    });
    delayInput.type = 'number';
    delayInput.value = 2;
    delayWrap.appendChild(delayInput);

    // ==== COUNTER BOX ====
    const counterWrap = document.createElement('div');
    Object.assign(counterWrap.style, {
        background: 'linear-gradient(135deg, #ff6b9d15 0%, #c06c8415 100%)',
        padding: '10px',
        borderRadius: '8px',
        marginTop: '10px',
        marginBottom: '8px',
        border: '1px solid #ffcdd2',
        fontSize: '14px',
        fontWeight: '500'
    });
    counterWrap.innerHTML = `
    <div style="display:flex; justify-content:space-between;">
        <span>✅ Sukses: <b id="cnt-s">0</b></span>
        <span>❌ Gagal: <b id="cnt-f">0</b></span>
    </div>
  `;
    box.appendChild(counterWrap);
    const cntS = counterWrap.querySelector('#cnt-s');
    const cntF = counterWrap.querySelector('#cnt-f');

    // ==== STATUS BOX ====
    const statusBox = document.createElement('div');
    Object.assign(statusBox.style, {
        height: '90px',
        background: '#f8f9fa',
        padding: '8px 12px',
        fontSize: '13px',
        borderRadius: '8px',
        overflowY: 'auto',
        border: '1px solid #e0e0e0',
        boxSizing: 'border-box'
    });
    box.appendChild(statusBox);

    // ==== LOADING ANIMASI ====
    const loading = document.createElement('div');
    loading.style.display = 'none';
    loading.style.margin = '10px 0';
    loading.innerHTML = `
    <div style="
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin: auto;
      border: 4px solid #ffc2d4;
      border-top-color: #ff6b9d;
      animation: spinPulse 0.9s linear infinite;
    "></div>
  `;
    const style = document.createElement('style');
    style.textContent = `
    @keyframes spinPulse {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(180deg); border-top-color:#ff8fab; }
      100% { transform: rotate(360deg); border-top-color:#ff6b9d; }
    }
  `;
    document.head.appendChild(style);
    box.appendChild(loading);

    // ==== BUTTON GROUP ====
    const btnWrap = document.createElement('div');
    Object.assign(btnWrap.style, {
        marginTop: '12px',
        display: 'flex',
        gap: '8px'
    });
    box.appendChild(btnWrap);

    function makeBtn(text, bg) {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            flex: '1',
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            background: bg,
            transition: 'transform 0.2s'
        });
        btn.textContent = text;
        btn.onmouseenter = () => btn.style.transform = 'scale(1.02)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';
        return btn;
    }

    const btnStart = makeBtn("Start", "linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)");
    const btnStop = makeBtn("Stop", "#e53935");
    const btnClose = makeBtn("Close", "#6c757d");

    btnWrap.appendChild(btnStart);
    btnWrap.appendChild(btnStop);
    btnWrap.appendChild(btnClose);

    document.body.appendChild(box);

    // ==== LOGIC ====
    let stop = false;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    btnStart.onclick = async () => {
        stop = false;

        const list = textarea.value.split("\n").map(v => v.trim()).filter(v => v);
        const delay = parseInt(delayInput.value) * 1000;

        statusBox.innerHTML = "";
        loading.style.display = "block";
        cntS.textContent = 0;
        cntF.textContent = 0;

        let successCount = 0, failCount = 0;

        for (let id of list) {
            if (stop) {
                loading.style.display = "none";
                statusBox.innerHTML += `<div>⛔ Proses dihentikan</div>`;
                return;
            }

            const ok = await gaskan(id);

            if (ok) successCount++;
            else failCount++;

            cntS.textContent = successCount;
            cntF.textContent = failCount;

            statusBox.innerHTML += `<div>${id}: ${ok ? '✅ Sukses' : '❌ Gagal'}</div>`;
            statusBox.scrollTop = statusBox.scrollHeight;

            await sleep(delay);
        }

        loading.style.display = "none";
        statusBox.innerHTML += `<div style="margin-top:6px;">🔵 Selesai</div>`;
        statusBox.scrollTop = statusBox.scrollHeight;
    };

    btnStop.onclick = () => stop = true;
    btnClose.onclick = () => box.remove();

    // ==== DRAG ====
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

    async function gaskan(uid) {
        try {
            const r = await fetch(`${origin}/api/graphql/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'x-asbd-id': '359341',
                    'x-fb-friendly-name': 'FriendingCometFriendRequestSendMutation',
                    'x-fb-lsd': config_['lsd']
                },
                body: new URLSearchParams({
                    'av': config_['av'],
                    '__aaid': '0',
                    '__user': config_['av'],
                    '__a': '1',
                    '__req': 'j',
                    '__hs': config_['hs'],
                    'dpr': '1',
                    '__ccg': 'EXCELLENT',
                    '__rev': config_['sr'],
                    '__s': 'sphexg:e3k934:ognbqc',
                    '__hsi': config_['hsi'],
                    '__dyn': '7xeUjGU5a5Q1ryaxG4Vp41twWwIxu13wFwhUKbgS3q2ibwNw9G2Sawba1DwUx60GE3Qwb-q7oc81EEc87m221Fwgo9oO0n24oaEnxO0Bo7O2l2Utwqo5W1ywiE4u9x-3m1mzXw8W58jwGzEaE5e3ym2SU4i5oe8cEW4-5pUfEe88o4Wm7-2K0-obUG2-azqwt8eo5d08O321LyUaUbGxe6Uak0zU8oC1Hg6C13xecwBwWzUlwEKufxamEbbxG1fBG2-2K0E8461wweW2K3abxG6E',
                    '__csr': 'gsgN6Nf6RsItsAl7h4Itf4laLn6ZTNBtlN4AKz4jj4ihmReIQBFuGZriinOQCPjjkApbAVSWXK9jrAitaGlaQF8HiCAzpFqnhFeXKlkEDVbGlKpKVECmp3BonLl4GfUSFbXADXxeUSjh4EC6VGBGiVpqyHz9XKiexCq7EKmiu9VUxfhEG6A9xa4bUyiqibh8pxLG3q9y448yUS7bCxi8GiVqGfgsgC5U88K9Uc89qxzxW8yoG2i4oOcKmeyUG6EK8wFwTUgyoqyE8UWcm9J0qHyUcUa8lwIgiDxm9Dw_wGxOE8UbouK3ei2a4UfE2JAyUW2S6U4C5oswSwbe5o7m3O2i0pe0cxwa60xXw4Xg7u0Qk0ki0-E10o2Tz8a40yU3sw9S0iYg1Exe0mC0um2O0C8420xHp4Udu3O3R4Dihof4tw9S3t02vU9804Vu045o03T9w3eU2czE1MU3ry81TC1yyUtg0CQw980gio1dS1bBwhQEkgnw4xw1de02zq0hu8ykby85kg04gU0xS080xq02Hm020u1xw2xU1IU3hxa2K0brw4Sw1RO9wlQ0Wqxi0aJ80IF8',
                    '__hsdp': 'gj8iyxW5oq5aF6CxG2afB8iGowzcG7Ni4949cOBA68GWcFaIc68wMwGDpqp28AIy5ZEpi4FJcx9banGzTOCTEh5EIbZlP14YxwFtgx6ggTNskgA8A1bb18x2cyGqmgBx9Hy5ELoYwZdkCaBOd92Vk9Bp5d7LKAicJGe-u21O8LTjrxy46lacJ99yhdmwxE45bEy4cG1koT5GI8772sfd7z2mCN325lGCgRAgSHJCrxymqi2SUuxC9y-EKp2XDrjjbsgt1eRzFUK5GBAGi72KS94AqHefyFyhggx28gIwaES44Q6GxaHJO6Gl0AycGxm3i3Cu8U8k5QEciAzpQCblw-wkAgEd8oxW2y2C9BAxW9wh42lw8y0UEbo2DwCxe6E36g9ooOxS1KyE0Pecw9Hc2y4-U2xwXw5-wk826wLwjoxk2q0lO2G1Hwbq1Ww2lE1bEao12Ekw15C7o0DW1Rw16S0ebw6qwoo3tw4Kwaq0qO361Ow6pw8S1UweW0AU0z20KE0yi2e04NE1oU2Qw2e8',
                    '__hblp': '1u3-0FE5e360hG4GK58dUG0yE-0Fbwzwg8982Sw9m0KUpwHBwem0SEgxa6oboW5U9U4m15xm3m3y1hxq0kS3i0QU2awea7US0FU9EjxG0NWw821dyE0wm0K87d08C2e0Teq3K0ua1Pwvo1fE7O6U1j80EK0iW0Bo2uUiyEdo4m0UU4i1Owww4Lwem7o2uwmE25wfWfwppE3Ew3vo2xCwdG1Hw_wa60Ko1CE66fwiEtxW2eayHDwrU2-waq0UU38wNyU6q0mW2G0zoa41eweW12Cwno3WwrotwAws8S7E2dxG9wIxa1vw4dwko8U2sw4twr8cU16E1dUnwHw4TAw9y5E1zU2EwiE',
                    '__sjsp': 'gj8iyxW5oq5aF6CxG2afB8iGowzcG7QlEJakAPl5AIgyHEOAGMMoy322GtBFA8yiOb4ZckiN2rj8iiOBDQhYFJA9smyZhlTRnc4jO66RtR6n6ggTNskgBNF2EfrMi8gz8GCBA8A4CEFqbKf849WoGeiz84amcy8iwJo56cACojAAcdwzyP5wDP0xglo2Fw41wSg3aw6zw1Ei',
                    '__comet_req': '15',
                    'fb_dtsg': config_['dtsg'],
                    'jazoest': '25509',
                    'lsd': config_['lsd'],
                    '__spin_r': config_['sr'],
                    '__spin_b': 'trunk',
                    '__spin_t': config_['st'],
                    '__crn': 'comet.fbweb.CometPYMKSuggestionsRoute',
                    'fb_api_caller_class': 'RelayModern',
                    'fb_api_req_friendly_name': 'FriendingCometFriendRequestSendMutation',
                    'server_timestamps': 'true',
                    'variables': JSON.stringify(
                        { "input": { "attribution_id_v2": "FriendingCometSuggestionsRoot.react,comet.friending.suggestions,via_cold_start,1764951118095,5768,,,", "click_proof_validation_result": null, "friend_requestee_ids": [uid], "friending_channel": "FRIENDS_HOME_MAIN", "people_you_may_know_location": "friends_home_main", "warn_ack_for_ids": [], "actor_id": config_['av'], "client_mutation_id": "1" }, "scale": 1 }),
                    'doc_id': '25461877203450505'
                })
            });

            const res = await r.json();
            if (res.data.friend_request_send.friend_requestees[0].friendship_status == 'OUTGOING_REQUEST') {
                return true
            }
            return false

        } catch (e) {
            return false
        }
    }

}