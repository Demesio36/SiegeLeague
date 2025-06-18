export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method not allowed'
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    const envKey = `USER_${username.toUpperCase()}`;
    const storedPassword = process.env[envKey];

    if (storedPassword && storedPassword === password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, username })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Invalid credentials" })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
