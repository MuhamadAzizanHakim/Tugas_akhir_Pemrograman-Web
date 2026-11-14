const adminSessionKey = "teduhalamAdminAuthenticated";

if (sessionStorage.getItem(adminSessionKey) !== "true") {
  window.location.replace("./login.html");
} else {
  document
    .getElementById("logout-admin-btn")
    .addEventListener("click", () => {
      sessionStorage.removeItem(adminSessionKey);
      window.location.replace("./login.html");
    });
}
