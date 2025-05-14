# CEAT Warranty Client Server

A standalone client server that securely communicates with the CEAT consumer campaign backend. This server acts as a middleware proxy for warranty registrations, handling HMAC authentication for all API calls.

## Features

- Secure communication with HMAC authentication
- Web interface for warranty registration
- Configurable environment settings
- Easy to set up and use

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Running CEAT consumer campaign backend server

## Installation

1. Clone or copy this folder to your desired location
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example`:

```
PORT=4000
MAIN_API_URL=http://localhost:8000
API_SECRET=supersecretkey123
DEBUG=false
```

> **Important:** Make sure the `API_SECRET` matches the one configured in your main backend server.

## Running the Server

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

## Testing the API Connection

A test script is included to verify your connection to the main backend:

```bash
node test-api.js
```

This will send a test warranty registration request directly to your backend and show detailed information about the request and response.

## Usage

1. Open your browser and navigate to `http://localhost:4000`
2. Fill out the warranty registration form
3. Submit the form to register the warranty

The server will handle HMAC authentication with the main backend API automatically.

## API Endpoints

### POST /api/submit-warranty

Submits a warranty registration to the main backend at `https://ceat-signature-drive-api.bespokesol.com/api/customers/customerWarranty`.

**Request Body:**

```json
{
  "mobile": "9988776655",
  "warrantyDetails": [
    {
      "warrantyNumber": "W-12345678",
      "productName": "PRODUCT NAME",
      "tyreSize": "SIZE"
    }
  ],
  "customerName": "CUSTOMER NAME",
  "warrantyRegistrationDate": "DD/MM/YYYY",
  "dealerName": "DEALER NAME"
}
```

**Response:**

```json
{
  "success": true,
  "message": "New customer created successfully"
}
```

## Security

This server implements HMAC authentication for all communication with the main backend:

- Timestamps to prevent replay attacks
- SHA-256 HMAC signatures
- Request expiration (5 minutes)

## Troubleshooting

If you encounter issues:

1. Check that your main backend server is running at https://ceat-signature-drive-api.bespokesol.com
2. Verify that the API_SECRET matches on both servers

4. Check the server logs for detailed error information 