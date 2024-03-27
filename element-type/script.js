const cookies = ["performance", "statistic", "marketing", "functional"];

async function fetchCookieBanner() {
  const res = await fetch("/api/plugins/cookiebanner-plugin/cookiebanner", {
    method: "GET",
  });
  return await res.json();
}

function setLinkToDataPrivacy(link) {
  document.getElementById("link-to-data-privacy").setAttribute("href", link);
}

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function initializeCookieBanner(json) {
  if (!getCookie("showCookiebanner")) {
    document.getElementById("cookie-bottom-banner").className =
      "fixed bottom-0 start-0 z-50 md:flex-wrap flex justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
  }
  if (json.active) {
    document.getElementById("cookie-banner-container").className = "";
    for (const cookie of cookies) {
      if (!json.categories[cookie].active) {
        document.getElementById(`${cookie}-cookie-toggle`).style.display = "none";
      }
    }
  }
}

function setEventListeners() {
  document.getElementById("acceptAllCookies").addEventListener("click", acceptAllCookies);
  document.getElementById("declineAllCookies").addEventListener("click", declineAllCookies);

  for (const cookie of cookies) {
    document.getElementById(`${cookie}-cookie`).addEventListener("change", setCookie);
  }
  document.getElementById("save-cookies-settings").addEventListener("click", saveCookies);
}

function setCookie(e) {
  const cookieName = e.target.id.replace("-cookie", "");
  document.cookie = `${cookieName}=${e.target.checked}; max-age=2592000; path=/; SameSite=Strict`;
}

function saveCookies() {
  document.cookie = "showCookiebanner=false; max-age=2592000; path=/; SameSite=Strict";
  location.reload();
}

function acceptAllCookies() {
  for (const cookie of cookies) {
    document.cookie = `${cookie}=true; max-age=2592000; path=/; SameSite=Strict`;
  }
  document.getElementById("cookie-bottom-banner").className = "hidden";
  saveCookies();
}

function declineAllCookies() {
  for (const cookie of cookies) {
    document.cookie = `${cookie}=false; max-age=2592000; path=/; SameSite=Strict`;
  }
  document.getElementById("cookie-bottom-banner").className = "hidden";
  saveCookies();
}

function handleBlockedResources(json) {
  for (const cookie of cookies) {
    let blockedElements = [];
    if (json.categories[cookie].blockedResources) {
      blockedElements = document.querySelectorAll(json.categories[cookie].blockedResources);
    }
    for (const el of blockedElements) {
      if (getCookie(cookie) === "true") {
        if (el.hasAttribute("data-type")) {
          const element = document.createElement(el.dataset.type);
          for (let i = 0; i < el.attributes.length; i++) {
            const attr = el.attributes[i];
            if (attr.name === "blocked-by") continue;
            element.setAttribute(attr.name.replace("blocked-", ""), attr.textContent);
          }
          el.replaceWith(element);
        }
      }
    }
  }
}

async function main() {
  const json = await fetchCookieBanner();
  initializeCookieBanner(json);
  setEventListeners();
  setLinkToDataPrivacy(json.link);
  handleBlockedResources(json);
}

main();
