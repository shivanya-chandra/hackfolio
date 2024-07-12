var notyf = new Notyf();
const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();  
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
        switch (data.status) {
            case "error": 
                notyf.error(data.message);
                break;
            case "success":                
                notyf.success("Logging in");      
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
                break;
            default:
                break;
        }
    });
});