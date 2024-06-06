const form = document.querySelector("form");
const user = {
  accessToken: "",
  userName: "",
};

form.onsubmit = (e) => {
  e.preventDefault();
  const [username, password] = Array.from(form.querySelectorAll("input")).map(
    (item) => item.value
  );
  if (!username || !password) {
    const errEl = document.createElement("p");
    const reason =
      !username && !password
        ? "Username and password are"
        : !username
        ? "Username is"
        : "Password is";
    errEl.textContent = `${reason} required!`;
    errEl.className = "err";
    document.body.appendChild(errEl);
    setTimeout(() => errEl.remove(), 2000);
  } else {
    // Post the login
    const json = {
      userName: username,
      password,
    };
    fetch("http://localhost/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(json),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        handleLogin(data);
      });
  }
};

function handleLogin(data) {
  user.accessToken = data.access_token;
  user.userName = username;
  const div = document.querySelector("div");
  div.id = "open";

  const ul = document.querySelector("ul");
  const getEmployees = div.querySelector("button:first-child");
  const logout = div.querySelector("button:last-child");

  getEmployees.addEventListener("click", (e) => {
    fetch(getEmployees.getAttribute("data-to"), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        ul.id = "open";
        data.employees.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.first_name + " " + item.last_name;
          ul.append(li);
        });
        ul.addEventListener("click", () => {
          while (ul.lastChild) ul.lastChild.remove();
          ul.removeAttribute("id");
        });
      });
  });

  logout.addEventListener("click", () => {
    fetch(logout.getAttribute("data-to"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          user.accessToken = "";
          user.userName = "";
          ul.removeAttribute("id");
          div.removeAttribute("id");
          Array.from(form.querySelectorAll("input")).map(
            (item) => (item.value = "")
          );
        }
      });
  });
}
