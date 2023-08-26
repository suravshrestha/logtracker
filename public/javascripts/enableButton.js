// eslint-disable-next-line no-unused-vars
function enableButton() {
    var buttonId = document.getElementById("createTeamSubmit");
    if (
        document.getElementById("new_supervisor").childElementCount > 0 &&
        (document.getElementById("new_student").childElementCount > 0 || document.getElementById("new_student_master").childElementCount > 0)
    ) {
        buttonId.disabled = false;
        buttonId.removeAttribute("title");
    } else {
        buttonId.disabled = true;
        buttonId.setAttribute("title", "Fill all fields to enable");
    }
}
