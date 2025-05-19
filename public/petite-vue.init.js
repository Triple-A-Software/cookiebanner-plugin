htmx.on("htmx:load", () => {
	initVue();
});
function initVue() {
	PetiteVue.createApp().mount();
}
