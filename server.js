const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const HmacClient = require('./hmacClient');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// Initialize HMAC client for API communication
const apiClient = new HmacClient(
  process.env.API_SECRET,
  process.env.MAIN_API_URL 
);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));



// Submit warranty endpoint - proxies requests to main API with HMAC authentication
app.post('/api/submit-warranty', async (req, res) => {
  try {
    const warrantyData = req.body;
    
    console.log('Received payload:', JSON.stringify(warrantyData, null, 2));
    
    // Validate required fields
    if (!warrantyData.mobile || !warrantyData.warrantyDetails || 
        !warrantyData.customerName || !warrantyData.warrantyRegistrationDate || 
        !warrantyData.dealerName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const endpoint = '/api/customers/customerWarranty';
    console.log(`Sending request to: ${apiClient.baseUrl}${endpoint}`);
    
    // Send authenticated request to main API
    const response = await apiClient.post(endpoint, warrantyData);
    
    console.log('Response received:', response.data);
    
    // Return the response from main API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error submitting warranty:');
    console.error('Error details:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server. The request was made but no response was received.');
      console.error('Request details:', error.request._currentUrl);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Error submitting warranty',
      errorDetails: {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data || 'No response data'
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Warranty Client Server running on port ${PORT}`);
  console.log(`Main API URL: ${process.env.MAIN_API_URL }`);
}); 