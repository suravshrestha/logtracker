const syncStudentBtn = document.getElementById("sync-students");

syncStudentBtn.addEventListener("click", async () => {
  const batchCheckboxes = document.getElementsByClassName("batch-checkbox");
  const programCheckboxes = document.getElementsByClassName("program-checkbox");

  const originalBtnText = syncStudentBtn.innerHTML;

  syncStudentBtn.disabled = true;
  syncStudentBtn.innerHTML = "Syncing...";

  const batches = Array.from(batchCheckboxes)
    .filter((batchCheckbox) => batchCheckbox.checked)
    .map((batchCheckbox) => batchCheckbox.id);

  const programs = Array.from(programCheckboxes)
    .filter((batchCheckbox) => batchCheckbox.checked)
    .map((programCheckbox) => programCheckbox.id);

  const query = `batches=${batches.join(",")}&programcodes=${programs.join(
    ","
  )}`;

  try {
    const response = await fetch(`/users/sync?${query}`, {
      method: "GET", // or "POST", "PUT", "DELETE", etc. depending on the action you want
      // You can add headers and other options here
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response data
      console.log("Server response:", data);
      window.alert(data.message);
    } else {
      console.error("Request failed:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    window.alert(error);
  }

  syncStudentBtn.innerHTML = originalBtnText;
  syncStudentBtn.disabled = false;
});
