import axios from 'axios';

const AULIFY_LOGIN_URL = 'https://www.aulify.mx/aulifyLogin'; // The URL provided

const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    console.log(`Attempting login for email: ${email}`);

    // Call the external Aulify login API
    const response = await axios.post(AULIFY_LOGIN_URL, {
      email: email,
      password: password,
    });

    // Check if the external API call was successful (status code 2xx)
    if (response.status >= 200 && response.status < 300) {
      console.log('Aulify login successful:', response.data);
      // Send the data received from Aulify back to the frontend
      res.json(response.data); 
    } else {
      // Handle non-2xx responses from Aulify if necessary, though axios might throw for these
      console.error(`Aulify login failed with status: ${response.status}`, response.data);
      res.status(response.status).json({ error: 'Authentication failed via external service.', details: response.data });
    }

  } catch (error) {
    // Handle errors during the axios request or other issues
    console.error('Error during Aulify login process:', error.response ? error.response.data : error.message);
    
    if (axios.isAxiosError(error) && error.response) {
      // If it's an Axios error with a response (like 401, 404, 500 from Aulify)
      res.status(error.response.status).json({ 
        error: 'Authentication failed.', 
        details: error.response.data || 'Could not connect to authentication service.' 
      });
    } else {
      // Network errors or other unexpected errors
      res.status(500).json({ error: 'An internal server error occurred during login.' });
    }
  }
};

export { doLogin };