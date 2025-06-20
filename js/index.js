document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    userList.innerHTML = ""; // clear previous results
    reposList.innerHTML = ""; // clear repos list
    searchUsers(searchTerm);
  });

  function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        data.items.forEach((user) => {
          displayUser(user);
        });
      })
      .catch((error) => console.error("Error fetching users:", error));
  }

  function displayUser(user) {
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" />
      <div>
        <p><strong>${user.login}</strong></p>
        <a href="${user.html_url}" target="_blank">View Profile</a>
      </div>
    `;

    userDiv.addEventListener("click", () => {
      reposList.innerHTML = ""; // clear previous repos
      fetchUserRepos(user.login);
    });

    userList.appendChild(userDiv);
  }

  function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    })
      .then((res) => res.json())
      .then((repos) => {
        repos.forEach((repo) => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          reposList.appendChild(li);
        });
      })
      .catch((error) => console.error("Error fetching repos:", error));
  }
});
