import React, { useState, useEffect } from "react";

function SignIn() {
  const [loginUrl, setLoginUrl] = useState(null);

  useEffect(() => {
    fetch("https://laracon.hackclub.app/api/v1/auth", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Something went wrong!");
      })
      .then((data) => setLoginUrl(data.url))
      .catch((error) => console.error(error));
  }, []);

  return <div>{loginUrl != null && <a href={loginUrl}>Google Sign In</a>}</div>;
}

export default SignIn;
