// APIS/USERS.JS

const BASE_URL = "http://localhost:5000/api/users";

export async function signup(values) {
  try {
    const response = await fetch("http://localhost:5000/api/signup", {  // Remplacez par l'URL correcte
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in signup function:", error);
    throw error;
  }
}



export async function signin(values) {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Une erreur s'est produite lors de la connexion");
    }

    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur s'est produite lors de la connexion");
  }
}


export const login = async (data) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const result = await response.json();
  return result;
};


