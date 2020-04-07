// ==UserScript==
// @name        Twitter - Copy screen names of Retweeter/likers of a Tweet
// @namespace   https://github.com/U-cauda-elongata
// @match       https://twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @grant       GM_setClipboard
// @version     0.1
// @updateURL   https://raw.githubusercontent.com/U-cauda-elongata/twitter-copy-screen-names.user.js
// @author      Yu Onaga
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

const defaultMenuID = 'user-uce-copy-accts';

(() => {
  'use strict';

  let menu;
  const menuID = document.body.getAttribute('contextmenu');
  if (! menuID) {
    menu = document.createElement('menu');
    menu.id = defaultMenuID;
    menu.type = 'context';
    document.body.setAttribute('contextmenu', defaultMenuID);
    document.body.appendChild(menu);
  } else {
    menu = document.getElementById(menuID);
  }

  const menuitem = document.createElement('menuitem');
  menuitem.label = 'Copy screen names';
  menuitem.icon = 'https://twitter.com/favicon.ico';

  let text;
  
  function twitterHandler(e) {
    const modal = e.target.closest('[aria-labelledby="modal-header"]')
    if (modal) {
      const accts = modal.querySelectorAll('a.r-1ny4l3l');
      const screen_names = Array.prototype.map.apply(accts, [n => n.attributes.href.textContent.slice(1)]);
      text = JSON.stringify(screen_names);
      menu.appendChild(menuitem);
    } else {
      menu.removeChild(menuitem);
    }
  }

  function tweetDeckHandler(e) {
    const col = e.target.closest('.js-column-social-proof');
    if (col) {
      const accts = col.querySelectorAll('.account-summary > [data-user-name]');
      const screen_names = Array.prototype.map.apply(accts, [e => e.dataset.userName]);
      text = JSON.stringify(screen_names);
      menu.appendChild(menuitem);
    } else {
      menu.removeChild(menuitem);
    }
  }

  document.body.addEventListener('contextmenu', location.host == 'twitter.com' ? twitterHandler : tweetDeckHandler);

  menuitem.addEventListener('click', e => {
    GM_setClipboard(text, 'text');
  });
})();