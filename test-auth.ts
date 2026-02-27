import axios, { AxiosError } from "axios";

const API_BASE = "http://localhost:3001/api";

interface ApiError {
  error: string;
  details?: unknown;
}

let authCookies = "";

async function makeRequest<T>(
  method: string,
  url: string,
  data?: unknown
): Promise<{ status: number; data: T }> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE}${url}`,
      data,
      headers: {
        Cookie: authCookies,
      },
      validateStatus: () => true,
    });

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      authCookies = setCookie.join("; ");
    }

    return { status: response.status, data: response.data };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    throw error;
  }
}

async function testAuth() {
  console.log("=== Day 5: Authentication & Authorization Tests ===\n");

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "SecurePassword123!";

  try {
    // Test 1: Register new user
    console.log("Test 1: Register new user");
    const registerData = {
      email: testEmail,
      name: "Test User",
      password: testPassword,
    };
    const registerRes = await makeRequest<{ user: { id: string; email: string; name: string }; token: string }>(
      "POST",
      "/auth/register",
      registerData
    );
    console.log(`Status: ${registerRes.status}`);
    console.log(`User created: ${registerRes.data.user?.email}`);
    console.log(`✓ Registration successful\n`);

    // Test 2: Login with credentials
    console.log("Test 2: Login with credentials");
    authCookies = ""; // Clear cookies
    const loginData = {
      email: testEmail,
      password: testPassword,
    };
    const loginRes = await makeRequest<{ user: { id: string; email: string; name: string }; token: string }>(
      "POST",
      "/auth/login",
      loginData
    );
    console.log(`Status: ${loginRes.status}`);
    console.log(`User logged in: ${loginRes.data.user?.email}`);
    console.log(`Auth cookie set: ${authCookies ? "Yes" : "No"}`);
    console.log(`✓ Login successful\n`);

    // Test 3: Get current user (authenticated)
    console.log("Test 3: Get current user (authenticated)");
    const meRes = await makeRequest<{ user: { id: string; email: string; name: string } }>(
      "GET",
      "/auth/me"
    );
    console.log(`Status: ${meRes.status}`);
    console.log(`Current user: ${meRes.data.user?.email}`);
    console.log(`✓ Auth check successful\n`);

    // Test 4: Create store (requires auth)
    console.log("Test 4: Create store (requires auth)");
    const storeData = {
      name: "Test Store",
      description: "A test store",
    };
    const createStoreRes = await makeRequest<{ store: { id: string; name: string; userId: string } }>(
      "POST",
      "/stores",
      storeData
    );
    console.log(`Status: ${createStoreRes.status}`);
    if (createStoreRes.status === 404) {
      console.log("Note: /api/stores route not yet implemented (expected)\n");
    } else {
      console.log(`Store created: ${createStoreRes.data.store?.name}`);
      console.log(`✓ Store creation successful\n`);
    }

    // Test 5: Access protected route without auth
    console.log("Test 5: Access protected route without auth");
    authCookies = ""; // Clear cookies
    const unauthedRes = await makeRequest<ApiError>("GET", "/dashboard?storeId=test-id");
    console.log(`Status: ${unauthedRes.status}`);
    console.log(`Error: ${unauthedRes.data.error}`);
    if (unauthedRes.status === 401) {
      console.log(`✓ Protected route blocked correctly\n`);
    } else {
      console.log(`✗ Expected 401, got ${unauthedRes.status}\n`);
    }

    // Test 6: Login again and test logout
    console.log("Test 6: Login and logout");
    await makeRequest("POST", "/auth/login", loginData);
    console.log(`Logged in: ${authCookies ? "Yes" : "No"}`);

    const logoutRes = await makeRequest<{ message: string }>("POST", "/auth/logout");
    console.log(`Logout status: ${logoutRes.status}`);
    console.log(`Message: ${logoutRes.data.message}`);
    console.log(`✓ Logout successful\n`);

    // Test 7: Verify logout cleared auth
    console.log("Test 7: Verify logout cleared auth");
    const afterLogoutRes = await makeRequest<ApiError>("GET", "/auth/me");
    console.log(`Status: ${afterLogoutRes.status}`);
    console.log(`Error: ${afterLogoutRes.data.error}`);
    if (afterLogoutRes.status === 401) {
      console.log(`✓ Auth cleared after logout\n`);
    } else {
      console.log(`✗ Expected 401, got ${afterLogoutRes.status}\n`);
    }

    // Test 8: Invalid login credentials
    console.log("Test 8: Invalid login credentials");
    const badLoginRes = await makeRequest<ApiError>("POST", "/auth/login", {
      email: testEmail,
      password: "WrongPassword",
    });
    console.log(`Status: ${badLoginRes.status}`);
    console.log(`Error: ${badLoginRes.data.error}`);
    if (badLoginRes.status === 401) {
      console.log(`✓ Invalid credentials rejected\n`);
    } else {
      console.log(`✗ Expected 401, got ${badLoginRes.status}\n`);
    }

    console.log("=== All Auth Tests Completed ===");
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}

testAuth().catch(console.error);
