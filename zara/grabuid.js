export function grabFrom(Container, _config) {
    // Inject styles
    const styles = `
    .grab-container {
      position: fixed;
      top: 100px;
      left: 100px;
      width: 400px;
      background: white;
      border-radius: 12px;
      border: 1px solid #ffb3d9;
      box-shadow: 0 12px 48px rgba(255, 107, 157, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      z-index: 999999;
      user-select: none;
    }

    .grab-header {
      padding: 12px 16px;
      cursor: grab;
      background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
      color: white;
      font-weight: 600;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .grab-header:active {
      cursor: grabbing;
    }

    .grab-close-btn {
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
    }

    .grab-content {
      padding: 16px;
    }

    .grab-btn-container {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }

    .grab-action-btn {
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 110px;
    }

    .grab-action-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
    }

    .grab-action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .grab-stop-btn {
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s ease;
      width: 100%;
      margin-top: 8px;
      display: none;
    }

    .grab-stop-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
    }

    .grab-input {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      border: 2px solid #ffb3d9;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .grab-input:focus {
      outline: none;
      border-color: #ff6b9d;
    }

    .grab-textarea {
      width: 100%;
      height: 220px;
      padding: 10px;
      border: 2px solid #ffb3d9;
      border-radius: 8px;
      font-family: monospace;
      font-size: 13px;
      resize: vertical;
      box-sizing: border-box;
      margin: 8px 0;
      transition: border-color 0.2s;
    }

    .grab-textarea:focus {
      outline: none;
      border-color: #ff6b9d;
    }

    .grab-status {
      margin: 10px 0;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      background: #fff0f6;
      color: #c06c84;
      min-height: 20px;
      border-left: 4px solid #ff6b9d;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .grab-bottom-btns {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .grab-copy-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #ff85b3 0%, #d084a0 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      flex: 1;
      transition: all 0.2s ease;
    }

    .grab-copy-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255, 133, 179, 0.4);
    }

    .grab-close-bottom-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #ff4d8c 0%, #b05070 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .grab-close-bottom-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255, 77, 140, 0.4);
    }

    .grab-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #ffb3d9;
      border-top-color: #ff6b9d;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: none;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
    const origin = window.location.origin;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Buat container utama
    const mainBox = document.createElement('div');
    mainBox.className = 'grab-container';
    mainBox.style.position = 'fixed';

    // Header
    const header = document.createElement('div');
    header.className = 'grab-header';
    header.innerHTML = `
    Dump Data
    <button class="grab-close-btn">&times;</button>
  `;
    mainBox.appendChild(header);

    // Make draggable
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('grab-close-btn')) return;
        isDragging = true;
        initialX = e.clientX - mainBox.offsetLeft;
        initialY = e.clientY - mainBox.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            mainBox.style.left = currentX + 'px';
            mainBox.style.top = currentY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Content
    const content = document.createElement('div');
    content.className = 'grab-content';

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'grab-btn-container';

    // Tombol Dump Teman
    const btnTeman = document.createElement('button');
    btnTeman.className = 'grab-action-btn';
    btnTeman.textContent = 'Dump Teman';
    btnContainer.appendChild(btnTeman);

    // Tombol Dump Suggest
    const btnSuggest = document.createElement('button');
    btnSuggest.className = 'grab-action-btn';
    btnSuggest.textContent = 'Dump Suggest';
    btnContainer.appendChild(btnSuggest);

    content.appendChild(btnContainer);

    // Input UID untuk Dump Publik
    const uidInput = document.createElement('input');
    uidInput.className = 'grab-input';
    uidInput.type = 'text';
    uidInput.placeholder = 'Masukkan UID target untuk Dump Publik...';
    content.appendChild(uidInput);

    // Tombol Dump Publik (full width)
    const btnPubContainer = document.createElement('div');
    btnPubContainer.style.cssText = 'margin: 8px 0;';
    const btnPublik = document.createElement('button');
    btnPublik.className = 'grab-action-btn';
    btnPublik.textContent = 'Dump Publik';
    btnPublik.style.width = '100%';
    btnPubContainer.appendChild(btnPublik);
    content.appendChild(btnPubContainer);

    // Tombol Stop
    const btnStop = document.createElement('button');
    btnStop.className = 'grab-stop-btn';
    btnStop.textContent = '⏹ Stop Dump';
    content.appendChild(btnStop);

    // Status
    const status = document.createElement('div');
    status.className = 'grab-status';
    const spinner = document.createElement('div');
    spinner.className = 'grab-spinner';
    status.appendChild(spinner);
    const statusText = document.createElement('span');
    statusText.textContent = 'Pilih menu dump di atas';
    status.appendChild(statusText);
    content.appendChild(status);

    // Textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'grab-textarea';
    textarea.placeholder = 'Hasil dump akan muncul di sini...';
    content.appendChild(textarea);

    // Bottom buttons
    const bottomBtns = document.createElement('div');
    bottomBtns.className = 'grab-bottom-btns';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'grab-copy-btn';
    copyBtn.textContent = '📋 Salin Hasil';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'grab-close-bottom-btn';
    closeBtn.textContent = '✕ Tutup';

    bottomBtns.appendChild(copyBtn);
    bottomBtns.appendChild(closeBtn);
    content.appendChild(bottomBtns);

    mainBox.appendChild(content);

    // Variable untuk kontrol stop
    let shouldStop = false;

    // Fungsi helper
    function setLoading(isLoading) {
        spinner.style.display = isLoading ? 'block' : 'none';
        btnTeman.disabled = isLoading;
        btnSuggest.disabled = isLoading;
        btnPublik.disabled = isLoading;
        btnStop.style.display = isLoading ? 'block' : 'none';
    }

    function appendToTextarea(uid) {
        if (textarea.value) {
            textarea.value += '\n' + uid;
        } else {
            textarea.value = uid;
        }
        textarea.scrollTop = textarea.scrollHeight;
    }

    async function dumpTeman(uid) {
        shouldStop = false;
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        if (!uid) {
            alert('UID tidak tersedia di config');
            return 0;
        }

        let totalFound = 0;
        try {
            const config = _config;
            const r = await fetch(`${origin}/ajax/typeahead/first_degree.php?dpr=1&__a=1&__af=iw&__be=-1&__pc=PHASED:DEFAULT&__user=${config['av']}&__dyn=7AzHK4HwBgC265Q2m3mbG2KnFw9uu2i5U4e0yqyUdEc88EW3K1uwJxS1Az8bo6u3y4o27w7nCxS320LE36xOfw9q224obEvy8465o-cBwfi12wOKdwGwFyFE-1-y85S5o9kbxSEtwi831wnEaoC9xy48aU8od8-UqwsUkxe2GewGwsoqBwNwKxm5oe8aUavxK3W2i&__req=8&__rev=${config['av']}&fb_dtsg=${config['dtsg']}&jazoest=25667&__spin_r=${config['av']}&__spin_b=trunk&__spin_t=${config['av']}&viewer=${config['av']}&token=0.13495365296964823&filter[0]=user&options[0]=friends_only`, {
                method: 'POST',
                credentials: 'include',
                headers: {}
            });

            if (shouldStop) return totalFound;

            const raw_res = await r.text();
            const userids = [...raw_res.matchAll(/"uid":\s*(\d+)/g)]
                .map(m => m[1]);

            for (let userId of userids) {
                if (shouldStop) break;
                appendToTextarea(userId);
                totalFound++;
                statusText.textContent = `Dumping teman... (${totalFound} ditemukan)`;
            }

            await delay(500);
        } catch (e) {
            console.log(e);
            throw e;
        }
        return totalFound;
    }


    async function dumpSuggest(uid) {
        shouldStop = false;
        try {
            let totalFound = 0;
            let cursor = null;
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            while (!shouldStop) {
                const resp = await fetch(`${origin}/api/graphql/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'x-asbd-id': '359341',
                        'x-fb-friendly-name': 'FriendingCometPYMKPanelPaginationQuery',
                        'x-fb-lsd': _config['lsd'],
                    },
                    body: new URLSearchParams({
                        'av': _config['av'],
                        '__aaid': '0',
                        '__user': _config['av'],
                        '__a': '1',
                        '__req': 'u',
                        '__hs': _config['hs'],
                        'dpr': '1',
                        '__ccg': 'EXCELLENT',
                        '__rev': _config['sr'],
                        '__s': 'wyfy31:yas0wg:6hp5pb',
                        '__hsi': _config['hsi'],
                        '__dyn': '7xeUjGU5a5Q1ryaxG4Vp41twWwIxu13wFwhUKbgS3q2ibwNw9G2Saw8i2S1DwUx60GE3Qwb-q7oc81EEc87m221Fwgo9oO0n24oaEnxO0Bo7O2l2Utwqo5W1ywiE4u9x-3m1mzXw8W58jwGzEaE5e3ym2SU4i5oe8cEW4-5pUfEe88o4Wm7-2K0-obUG2-azqwt8eo88cA0z8c84q58jyUaUbGxe6Uak0zU8oC1Hg6C13xecwBwWzUlwEKufxamEbbxG1fBG2-2K0E8461wweW2K3abxG6E2Uw',
                        '__csr': 'gugT4jsAD1hf2IID69YhdYdn4aPbRZYJOh4ObazSBfWPtl-n9fYNdLaIOZRJfGAZyXj8KGHx1QAuqAhrUCdQExV8S9A-WxjCl6CzFAcGnBCKjhEhyEGbKbyuivz8gBx6u9AzEkKQ68sghKm1aVGyHx22G2-m2N1i4EGi2e5UGEa8vxuUpyEowge9yaDyo5K2O8zo4W1Gyoy1bAzUrwr8hK7GyE42GoTzonwFg8EaU2Bxy48ox62m2C6oOfyohwsomw-grwGzU5uaAweuawBwso2iw3To1uUqwd20F409o404fxy0lKexu1cUwBwTwm85a09_w8G0dPw7twmy2ER0k813o1P8uwrGw0qz80iTw0e5MwbE0gJo3gDg1P87-4E0rcw5hwdK028KU0CG1kw35o1kXa0ne0cQycw8o2uw2S87u09to0gxwtU4G02zS02cJw2bk032-0aLxO0cVyVC',
                        '__hsdp': 'gnEU88jgp6Exy8qxp28giSgAoGFF8Op29c8aosMAgqNpa8iwrFGzdFqAb2L3uB5GhBAaKKx4z3ApMF2tWaEi2IcOOsigld94b1qpgUD65bEIpIGftkpyjeshy94988hk9LFjmDJ2fAgLINl2KUyGGup8x2oK66dMwy8hFqaypdaHyy2HBhHET5h5uWWA3BJbBicg4syNxAvi55EkMIH20jHT48oOJJ9ibEP-VHyfmqF48y8-ezU9poy2mfyVkmQEgjHhLGSxVoyaxedUmyUHG8Dxe6F2jNxq8Au74pckicG420Qqx2i5U8pqAWdzEsG8LEEW6A3aE8UuURk48eyUbEgzya2Zk7o5x99wIwBDxeewyxO2aEzDu4o4zwgUB2pEG5-74u8g8E21wJyE27wkE2Qxe1vgcoiyoMM33w6jwuE2Fwae2diwjWg5O1zw6awDwZwd23O26bAU2bw53xS0Lo2vw2zotwdO361uwuE0YK0hm0Ko3Jw19605q86a0JEkw8q1Pw6AwDw5Awa-5E3Tw6CwbW0R80BG1gweu2y04Jo3ew20U7-09rw',
                        '__hblp': '1yfgbUkw9W3K2q0gScCBG2O5E3sAw82fwzwOxC0Npo6y0WUsxq7WwbGbw43zotxu3G5o-5Ef8b8eUbp8dEqwXw6Kg2Lwko6O0Ho422Saw8u1iwbi4U623ucwd-0QU2Lzu15yEao1tE2OwoU1IEfo36w2qo1v82qw7Nwem2y16xu1TG13w7Fz82qwzwae2S0hm0Ko3JwGw820CUf81z8nw5qz84G0eKw5KwoEaokwtUkw8q1Pwfu2i6qG1DK2e0i213wa-5E4G0H84G0lK0LE3ayo0Da3y0VUa8621Hw2v83uw8O6o2bwEwn84C0gqFU4qUC1AAyUvz86O0jO3e1gw',
                        '__sjsp': 'gnEU88jgp6Exy8IW5A8x1bp5NyGCAz9A8ANmd5QglJ46IkmSiwrDGCSBGgIRNn2SiB9O7oWiKyQAgIl5OOA2D5OTEGx8aMPb9N1hkQAgI5FAwSKyExBWQxnJWld5gjub42EYwZ3p5aA5rAxlCwAwCwCoS2qcu2G5o2swdmaweC310cy1bw8W0-o0Be1lo5W1dgC2DxN7y42a0bNw30o',
                        '__comet_req': '15',
                        'locale': 'id_ID',
                        'fb_dtsg': _config['dtsg'],
                        'jazoest': '25506',
                        'lsd': _config['lsd'],
                        '__spin_r': _config['sr'],
                        '__spin_b': 'trunk',
                        '__spin_t': _config['st'],
                        '__crn': 'comet.fbweb.CometPYMKSuggestionsRoute',
                        'fb_api_caller_class': 'RelayModern',
                        'fb_api_req_friendly_name': 'FriendingCometPYMKPanelPaginationQuery',
                        'server_timestamps': 'true',
                        'variables': JSON.stringify({ "count": 30, "cursor": cursor, "location": "FRIENDS_HOME_MAIN", "scale": 1 }),
                        'doc_id': '9917809191634193'
                    })
                });
                const res = await resp.json();

                const edges = res?.data?.viewer?.people_you_may_know?.edges ?? [];
                for (let y of edges) {
                    if (shouldStop) break;
                    let uids = y?.node?.id;
                    if (uids) {
                        appendToTextarea(uids);
                        totalFound++;
                        statusText.textContent = `Dumping suggest... (${totalFound} ditemukan)`;
                    }
                }

                const pageInfo = res?.data?.viewer?.people_you_may_know?.page_info;

                if (!pageInfo?.has_next_page || shouldStop) {
                    break;
                }

                cursor = pageInfo.end_cursor;
                await delay(2000);
            }

            return totalFound;

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // Fungsi Grab Publik
    async function grabPublik(uid) {
        shouldStop = false;
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // TODO: Implementasi grab publik dengan pagination
        // Simulasi untuk contoh
        const mockData = ['100001234567890', '100009876543210', '100005555555555'];
        for (let i = 0; i < mockData.length; i++) {
            if (shouldStop) break;
            appendToTextarea(mockData[i]);
            statusText.textContent = `Dumping publik... (${i + 1} ditemukan)`;
            await delay(500);
        }
        return mockData.length;
    }

    // Event handlers
    btnTeman.onclick = async () => {
        const uid = _config.av || '';
        textarea.value = ''; // Clear textarea
        setLoading(true);
        try {
            const count = await dumpTeman(uid);
            if (shouldStop) {
                statusText.textContent = `⏹ Dump Teman dihentikan! (${count} teman)`;
            } else {
                statusText.textContent = `✓ Dump Teman selesai! (${count} teman)`;
            }
        } catch (error) {
            statusText.textContent = `✗ Error: ${error.message}`;
        } finally {
            setLoading(false);
        }
    };

    btnSuggest.onclick = async () => {
        const uid = _config.av || '';
        textarea.value = ''; // Clear textarea
        setLoading(true);
        try {
            const count = await dumpSuggest(uid);
            if (shouldStop) {
                statusText.textContent = `⏹ Dump Suggest dihentikan! (${count} suggest)`;
            } else {
                statusText.textContent = `✓ Dump Suggest selesai! (${count} suggest)`;
            }
        } catch (error) {
            statusText.textContent = `✗ Error: ${error.message}`;
        } finally {
            setLoading(false);
        }
    };

    btnPublik.onclick = async () => {
        const uid = uidInput.value.trim();
        if (!uid) {
            statusText.textContent = '⚠ Masukkan UID target terlebih dahulu!';
            return;
        }
        textarea.value = ''; // Clear textarea
        setLoading(true);
        try {
            const count = await grabPublik(uid);
            if (shouldStop) {
                statusText.textContent = `⏹ Dump Publik dihentikan untuk UID: ${uid} (${count} uid)`;
            } else {
                statusText.textContent = `✓ Dump Publik selesai untuk UID: ${uid} (${count} uid)`;
            }
        } catch (error) {
            statusText.textContent = `✗ Error: ${error.message}`;
        } finally {
            setLoading(false);
        }
    };

    btnStop.onclick = () => {
        shouldStop = true;
        statusText.textContent = 'Menghentikan proses...';
    };

    copyBtn.onclick = () => {
        if (textarea.value) {
            textarea.select();
            document.execCommand('copy');
            statusText.textContent = '✓ Hasil berhasil disalin ke clipboard!';
        } else {
            statusText.textContent = '⚠ Tidak ada data untuk disalin!';
        }
    };

    const closeButtons = mainBox.querySelectorAll('.grab-close-btn, .grab-close-bottom-btn');
    closeButtons.forEach(btn => {
        btn.onclick = () => {
            shouldStop = true;
            mainBox.remove();
            styleTag.remove();
        };
    });

    // Tambahkan ke container atau body
    (Container || document.body).appendChild(mainBox);

    return mainBox;
}