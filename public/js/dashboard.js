var notyf = new Notyf();

newMentee = () => {
  console.log("you have clicked new mentee function");
  fetch("/mentee/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      notyf.success("You are now a mentee!");
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      notyf.error("Some error occurred! Try again later");
    }
  });
};

newMentor = () => {
  fetch("/mentor/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      notyf.success("You are now a mentor!");
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      notyf.error("Some error occurred! Try again later");
    }
  });
};

getMentors = () => {
  console.log("running this");
  fetch("/mentor/get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        notyf.error("Some error occurred! Try again later");
      }
    })
    .then((data) => {
      const mentors = data.mentors;
      console.log(mentors);

      const mentorList = document.getElementById("mentors");
      for (let i = 0; i < mentors.length; i++) {
        let mentor = mentors[i];
        console.log(mentor);
        let mentorCard = document.createElement("div");
        mentorCard.classList.add("card2");
        mentorCard.innerHTML = `
           <h1>${mentor.college}</h1>
            <div class="card-content">
             <h3>${mentor.name} <br>
             Major: ${mentor.major.join(", ")} <br>
            Minors: ${mentor.minor.join(", ")} <br>
             </h3>
            <p>
            
            </p>
            </div>
        </div>
        `;
        mentorList.appendChild(mentorCard);
      }
      return;
    });
};

sendRequest = () => {
  console.log("here");
  var inputEmail = document.getElementById("email").value;
  console.log("Send request button clicked, email:", inputEmail);
  var data = {
    receiverEmail: inputEmail,
  };

  console.log("this is data from sender email", data);
  console.log("hey from sendRequest function");
  fetch("/sendReq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response data:", data);
      switch (data.status) {
        case "error":
          notyf.error(data.message);
          break;
        case "success":
          notyf.success(data.message);
          break;
        default:
          notyf.error("An error occurred");
          break;
      }
      inputEmail = "";
    })
    .catch((error) => {
      console.error("Error:", error);
      notyf.error("Some error");
    });
};

acceptRequest = (e) => {
  const requestSender = e.target.getAttribute("data-sender");
  console.log("Accept button clicked, request sender:", requestSender);
  var data = {
    status: "accepted",
    requester: requestSender,
  };

  fetch("/addFriend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response data:", data);
      switch (data.status) {
        case "error":
          notyf.error(data.message);
          break;
        case "success":
          notyf.success(data.message);
          break;
        default:
          notyf.error("Some error");
          break;
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((error) => {
      console.error("Error:", error);
      notyf.error("Some error");
    });
};

rejectRequest = (e) => {
  const requestSender = e.target.getAttribute("data-sender");
  console.log("Reject button clicked, request sender:", requestSender);
  var data = {
    status: "rejected",
    requester: requestSender,
  };
  console.log("this is the data", data);

  fetch("/addFriend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response data:", data);
      switch (data.status) {
        case "error":
          notyf.error(data.message);
          break;
        case "success":
          notyf.success(data.message);
          break;
        default:
          notyf.error("Some error");
          break;
      }
      // reload window
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((error) => {
      console.error("Error:", error);
      notyf.error("Some error");
    });
};

editProfile = () => {
  console.log("You clicked edit-profile!!");
  window.location.href = "http://localhost:8080/profile";
};
