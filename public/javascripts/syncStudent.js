document.getElementById("syncStudent").addEventListener("click", async () => {
  try {
    const response = await fetch("/users/sync", {
      method: "GET", // or "POST", "PUT", "DELETE", etc. depending on the action you want
      // You can add headers and other options here
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response data
      console.log("Server response:", data);
    } else {
      console.error("Request failed:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

document.getElementById("syncSubject").addEventListener("click", async () => {
  try {
    const response = await fetch("/faculty/sync", {
      method: "GET", // or "POST", "PUT", "DELETE", etc. depending on the action you want
      // You can add headers and other options here
    });

    if (response.ok) {
      const data = await response.json(); // Parse the response data
      console.log("Server response:", data);
    } else {
      console.error("Request failed:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
