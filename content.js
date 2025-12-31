// === STYLES ===
const styles = `
  #fb-float-btn-container {
    position: fixed;
    z-index: 999999;
  }

  #fb-float-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
    border: none;
    cursor: grab;
    box-shadow: 0 8px 24px rgba(255, 107, 157, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
  }

  #fb-float-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 32px rgba(255, 107, 157, 0.6);
  }

  #fb-float-btn:active {
    cursor: grabbing;
  }

  #fb-float-btn svg {
    width: 32px;
    height: 32px;
    fill: white;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }

  .zara-bot-name {
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.95);
    color: #c06c84;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    letter-spacing: 0.5px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  #fb-float-menu {
    position: absolute;
    bottom: 80px;
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.2);
    list-style: none;
    padding: 8px;
    min-width: 200px;
    display: none;
    margin: 0;
  }

  #fb-float-menu.show {
    display: block;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  #fb-float-menu li {
    padding: 12px 16px;
    cursor: pointer;
    border-radius: 10px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  #fb-float-menu li:hover {
    background: linear-gradient(135deg, #ff6b9d15 0%, #c06c8415 100%);
    transform: translateX(-2px);
  }

  #fb-float-menu li svg {
    width: 20px;
    height: 20px;
    fill: #ff6b9d;
    flex-shrink: 0;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);


// === FLOATING BUTTON CONTAINER ===
const container = document.createElement('div');
container.id = 'fb-float-btn-container';

// Restore last position of floating button
const savedPos = JSON.parse(localStorage.getItem('fbFloatBtnPos'));
if (savedPos) {
  container.style.left = savedPos.left + 'px';
  container.style.top = savedPos.top + 'px';
  container.style.bottom = 'auto';
  container.style.right = 'auto';
} else {
  container.style.bottom = '40px';
  container.style.right = '40px';
}

container.style.position = 'fixed';
document.body.appendChild(container);


// === BUTTON ===
const button = document.createElement('button');
button.id = 'fb-float-btn';
button.innerHTML = `
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
  <span class="zara-bot-name">Zara Bot</span>
`;
container.appendChild(button);


// === MENU ===
const menu = document.createElement('ul');
menu.id = 'fb-float-menu';
container.appendChild(menu);

// MENU ITEMS
const menuItems = [
  {
    text: 'Grab uid',
    icon: `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    action: async () => {
      const m = await import(chrome.runtime.getURL('zara/grabuid.js'));
      const c = await import(chrome.runtime.getURL('zara/config.js'));
      const i = c.__init__()
      if (!i) {
        alert('Maaf terjadi kesalahan.');
      }
      const menuElement = document.getElementById('fb-float-menu');
      m.grabFrom(menuElement, i);
    }
  },

  {
    text: 'Add teman',
    icon: `<svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V8c0-.55-.45-1-1-1s-1 .45-1 1v2H2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    action: async () => {
      const m = await import(chrome.runtime.getURL('zara/addFriend.js'));
      const c = await import(chrome.runtime.getURL('zara/config.js'));
      const i = c.__init__()
      if (!i) {
        alert('Maaf terjadi kesalahan.');
      }
      const menuElement = document.getElementById('fb-float-menu');
      m.FBaddFriend(menuElement, i);
    }
  },

  {
    text: 'Posting',
    icon: `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
    action: async () => {
      const m = await import(chrome.runtime.getURL('zara/posting.js'));
      const c = await import(chrome.runtime.getURL('zara/config.js'));
      const i = c.__init__()
      if (!i) {
        alert('Maaf terjadi kesalahan.');
      }
      const menuElement = document.getElementById('fb-float-menu');
      m.FBPost(menuElement, i)
    }
  },

  {
    text: 'Tag teman',
    icon: `<svg viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>`,
    action: async () => {
      const m = await import(chrome.runtime.getURL('zara/tagteman.js'));
      const c = await import(chrome.runtime.getURL('zara/config.js'));
      const i = c.__init__()
      if (!i) {
        alert('Maaf terjadi kesalahan.');
      }
      let tagContainer = document.getElementById('zara-tag-panel');
      if (!tagContainer) {
        tagContainer = document.createElement('div');
        tagContainer.id = 'zara-tag-panel';
        document.body.appendChild(tagContainer);
      }
      m.Tagmyfriend(tagContainer, i)
    }
  },
];

// RENDER MENU ITEMS
menuItems.forEach(item => {
  const li = document.createElement('li');
  li.innerHTML = `${item.icon} ${item.text}`;
  li.onclick = item.action;
  menu.appendChild(li);
});

// === Menu Toggle ===
button.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!container.contains(e.target)) {
    menu.style.display = 'none';
  }
});


// === DRAG FLOATING BUTTON ===
let drag = false, startX, startY, origX, origY;

button.addEventListener('mousedown', (e) => {
  drag = true;
  startX = e.clientX;
  startY = e.clientY;

  const rect = container.getBoundingClientRect();
  origX = rect.left;
  origY = rect.top;

  button.style.cursor = 'grabbing';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!drag) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  container.style.left = origX + dx + 'px';
  container.style.top = origY + dy + 'px';
  container.style.bottom = 'auto';
  container.style.right = 'auto';
});

document.addEventListener('mouseup', () => {
  if (!drag) return;
  drag = false;

  // save position
  const rect = container.getBoundingClientRect();
  localStorage.setItem('fbFloatBtnPos', JSON.stringify({ left: rect.left, top: rect.top }));

  button.style.cursor = 'grab';
});