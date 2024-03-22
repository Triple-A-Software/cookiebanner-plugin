const cookies = ["performance", "statistic", "marketing"];

async function fetchCookieBanner() {
    const res = await fetch("/api/plugins/cookiebanner-plugin/cookiebanner", {
        method: "GET",
    });
    return await res.json();
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
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
        cookies.forEach((cookie) => {
            if (!json.categories[cookie].active) {
                document.getElementById(cookie + "-cookie-toggle").style.display = "none";
            }
        });
    }
}

function setEventListeners() {
    document.getElementById("acceptAllCookies").addEventListener("click", acceptAllCookies);
    document.getElementById("declineAllCookies").addEventListener("click", declineAllCookies);

    cookies.forEach((cookie) => {
        document.getElementById(cookie + "-cookie").addEventListener("change", setCookie);
    });
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
    cookies.forEach((cookie) => {
        document.cookie = `${cookie}=true; max-age=2592000; path=/; SameSite=Strict`;
    });
    document.getElementById("cookie-bottom-banner").className = "hidden";
    saveCookies();
}

function declineAllCookies() {
    cookies.forEach((cookie) => {
        document.cookie = `${cookie}=false; max-age=2592000; path=/; SameSite=Strict`;
    });
    document.getElementById("cookie-bottom-banner").className = "hidden";
    saveCookies();
}

function blockResources(json) {
    if (json.active) {
        const elementsWithBlockedBy = document.querySelectorAll("[blocked-by]");
        elementsWithBlockedBy.forEach((element) => {
            const blockedByValue = element.getAttribute("blocked-by");
            if (json.categories[blockedByValue].active && getCookie(blockedByValue) !== "true") {
                element.outerHTML = json.html;
            }
        });
    }
}

async function main() {
    const json = await fetchCookieBanner();
    initializeCookieBanner(json);
    setEventListeners();
    blockResources(json);
}

main();
