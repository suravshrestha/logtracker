/* eslint-disable no-undef */
$(document).ready(function () {
  $(".addSuper").on("click", addSuper);
  const superPastChildren = $("#new_supervisor").children().length;
  const studPastChildren = $("#new_student").children().length;
  const masterStudPastChildren = $("#new_student_master").children().length;
  console.log(superPastChildren);

  function addSuper() {
    const superValue = $("#addSuper").val();
    if (superValue === "") return;
    const lastField = $("#new_supervisor div:last");
    const intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    const userSelect = document.getElementById("addSuper");
    const fieldWrapper = $(
      "<div class=\"fieldwrapper\" id=\"field" + (intId + superPastChildren) + "\"/>"
    );
    fieldWrapper.data("idx", intId);
    const new_input = $("<input class='button-type' name='supervisor" + (intId + superPastChildren) + "' value ='" + userSelect.value + "' readonly />");
    const removeButton = $(
      "<input type=\"button\" class=\"remove\" value=\"-\" />"
    );
    removeButton.click(function () {
      $(this).parent().remove();
      enableButton();
    });
    fieldWrapper.append(new_input);
    fieldWrapper.append(removeButton);
    $("#new_supervisor").append(fieldWrapper);
    $("#addSuper").val("");
    enableButton();
  }


  $(".addStud").on("click", addStud);
  function addStud() {
    const studValue = $("#addStudent").val();
    if (studValue === "") return;
    const lastField = $("#new_student div:last");
    const intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    const userSelect = document.getElementById("addStudent");
    const fieldWrapper = $(
      "<div class=\"fieldwrapper\" id=\"studField" + (intId + studPastChildren) + "\"/>"
    );
    fieldWrapper.data("idx", intId);
    const new_input = $("<input class='button-type' name='std" + (intId + studPastChildren) + "' value ='" + userSelect.value + "' readonly />");
    const removeButton = $(
      "<input type=\"button\" class=\"remove\" value=\"-\" />"
    );
    removeButton.click(function () {
      $(this).parent().remove();
      enableButton();
    });
    fieldWrapper.append(new_input);
    fieldWrapper.append(removeButton);
    $("#new_student").append(fieldWrapper);
    $("#addStudent").val("");
    enableButton();
  }

  $(".addStudMaster").on("click", addStudMaster);
  function addStudMaster() {
    const masterStudValue = $("#addStudentMaster").val();
    if (masterStudValue === "") return;
    const lastField = $("#new_student_master div:last");
    const intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    const userSelect = document.getElementById("addStudentMaster");
    const fieldWrapper = $(
      "<div class=\"fieldwrapper\" id=\"masterStudField" + (intId + masterStudPastChildren) + "\"/>"
    );
    fieldWrapper.data("idx", intId);
    const new_input = $("<input class='button-type' name='std1" + (intId + masterStudPastChildren) + "' value ='" + userSelect.value + "' readonly />");
    const removeButton = $(
      "<input type=\"button\" class=\"remove\" value=\"-\" />"
    );
    removeButton.click(function () {
      $(this).parent().remove();
      enableButton();
    });
    fieldWrapper.append(new_input);
    fieldWrapper.append(removeButton);
    $("#new_student_master").append(fieldWrapper);
    $("#addStudentMaster").val("");
    enableButton();
  }
});
