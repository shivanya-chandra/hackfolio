var notyf = new Notyf();
const regBtn = document.querySelector("#regBtn");

regBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const password2 = document.querySelector("#password2").value;

  fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      password2: password2,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
        switch (data.status) {
            case "error": 
                notyf.error(data.message);
                break;
            case "success":
                notyf.success(data.message);
                notyf.success("Redirecting to Dashboard");      
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
                break;
            case "notVerified":
              setTimeout(() => {
                window.location.href = '/auth/verification';
              }, 2000)
            default:
                break;
        }
    });
});