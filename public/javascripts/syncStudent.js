const syncStudentBtn = document.getElementById("syncStudent");

syncStudentBtn.addEventListener("click", async () => {
  const originalBtnText = syncStudentBtn.innerHTML;

  syncStudentBtn.disabled = true;
  syncStudentBtn.innerHTML = "Syncing...";

  try {
    const response = await fetch("/users/sync", {
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
