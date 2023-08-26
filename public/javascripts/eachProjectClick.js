const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        const currentTooltip = this.firstElementChild;
        if (content.style.display === "block") {
            content.style.display = "none";
            currentTooltip.innerHTML = "Click to view details";
        } else {
            content.style.display = "block";
            currentTooltip.innerHTML = "Click to hide details";
        }
    });

}
