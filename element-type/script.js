const res = await fetch("/api/plugins/cookiebanner-plugin/cookiebanner", {
	method: "GET",
});
const json = await res.json();
checkIframes();
if (!getCookie("showCookiebanner")) {
	document.getElementById("cookie-bottom-banner").className =
		"fixed bottom-0 start-0 z-50 flex justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
}
if (json.active) {
	document.getElementById("cookie-banner-container").className = "";
}
document
	.getElementById("acceptAllCookies")
	.addEventListener("click", acceptAllCookies);
document
	.getElementById("toggle-performance-cookie")
	.addEventListener("change", setPerformanceCookies);
document.getElementById("toggle-performance-cookie").checked =
	getCookie("performance") === "true" ? true : false;
document
	.getElementById("save-cookies-settings")
	.addEventListener("click", saveCookies);

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

function saveCookies() {
	document.cookie =
		"showCookiebanner=false; max-age=2592000;path=/; SameSite=Strict";
	location.reload();
}

function setPerformanceCookies(e) {
	document.cookie = `performance=${e.target.checked}; max-age=2592000;path=/; SameSite=Strict`;
}

function acceptAllCookies() {
	document.cookie = "performance=true; max-age=2592000;path=/; SameSite=Strict";
	document.cookie =
		"showCookiebanner=false; max-age=2592000;path=/; SameSite=Strict";
	document.getElementById("cookie-bottom-banner").className = "hidden";
}

function checkIframes() {
	if (json.active) {
		let iframes = document.body.getElementsByTagName("iframe");
		for (let i = 0; i < iframes.length; i++) {
			let currentIframe = iframes[i];
			if (document.cookie.includes("performance=true")) {
				if (currentIframe.getAttribute("data-src")) {
					currentIframe.setAttribute(
						"src",
						currentIframe.getAttribute("data-src"),
					);
				}
			} else {
				if (currentIframe.outerHTML) {
					currentIframe.outerHTML = json.html;
				}
			}
		}
	}
}
