import API_URL from "./apiClient";

export async function testLogin(): Promise<any> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "tester1",
            password: "Im_testing_TS"
        })
    });
    
    const data = await response.json();
    console.log("Login response:", data);

    return data;
}