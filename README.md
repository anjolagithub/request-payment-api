
# Quiktis Request Network Integration

## Overview

Quiktis is a decentralized ticketing platform that eliminates fraud, reduces fees, and empowers event organizers and attendees with secure, transparent, and cost-efficient transactions. This repository contains the backend integration with **Request Network**, enabling seamless creation and management of ERC-20 payment requests.

This implementation runs on the **Sepolia testnet**, leveraging the **Request Client SDK** to simplify blockchain interactions, removing the need for custom smart contracts.

---

## Features

- **Decentralized Payments**: Securely process ERC-20 payments via Request Network.
- **Fee-less Transactions**: Create requests without additional fees.
- **Transparent and Immutable**: Transactions are fully traceable on the blockchain.
- **Easy Integration**: Provides RESTful API endpoints for frontend connectivity.
- **Secure Identity**: Uses Ethereum private key signatures to ensure secure authorization.

---

## Installation

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A Sepolia testnet wallet with:
  - A private key (for the payee).
  - Access to Sepolia ETH and the relevant ERC-20 tokens.

### Clone the Repository

```bash
git clone https://github.com/<your-repo-name>.git
cd <your-repo-name>
```

### Install Dependencies

```bash
npm install
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root directory with the following:

```env
PORT=3000
PAYEE_PK=YOUR_PRIVATE_KEY
```

- **PORT**: Port for running the server.
- **PAYEE_PK**: The Ethereum wallet private key for signing payment requests.

> ⚠️ **Important**: Keep your private key secure and do not share it.

---

## Usage

### Starting the Server

1. Start the server:
   ```bash
   npm start
   ```
2. The server will run on `http://localhost:3000` by default.

3. Test the endpoint using **Postman**, **cURL**, or a frontend.

---

## API Endpoints

### 1. **Create Payment Request**

**URL**: `/create-request`  
**Method**: `GET`  

**Request Body**:
```json
{
  "amount": "100",
  "payerAddress": "0xPAYER_ADDRESS_HERE"
}
```

- `amount`: The payment amount (in token units).
- `payerAddress`: The Ethereum wallet address of the attendee.

**Example Response**:
```json
{
  "message": "Request created successfully.",
  "requestID": "0xREQUEST_ID"
}
```

---

## Code Explanation

### Key Logic

- **Request Initialization**:
  ```javascript
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network/",
    },
    signatureProvider: epkSignatureProvider,
  });
  ```
  This initializes the Request Client SDK, connecting it to the Sepolia testnet.

- **Creating a Payment Request**:
  ```javascript
  const requestCreateParameters = {
    requestInfo: {
      currency: { type: Types.RequestLogic.CURRENCY.ERC20, value: "TOKEN_ADDRESS", network: "sepolia" },
      expectedAmount: utils.parseUnits(amount, 18).toString(),
      payee: { type: Types.Identity.TYPE.ETHEREUM_ADDRESS, value: payeeIdentity },
      payer: { type: Types.Identity.TYPE.ETHEREUM_ADDRESS, value: payerIdentity },
    },
    paymentNetwork: { id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT, parameters: { paymentAddress: paymentRecipient } },
  };

  const request = await requestClient.createRequest(requestCreateParameters);
  const requestData = await request.waitForConfirmation();
  ```
  This code handles all the payment request logic, ensuring security and reliability.

---

## Frontend Integration

### Example Integration

To connect the backend API to your frontend:
1. Create a form for ticket purchase that collects `amount` and `payerAddress`.
2. Use the following example code for making a request:

```javascript
fetch("http://localhost:3000/create-request", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: "100",
    payerAddress: "0xPAYER_WALLET_ADDRESS"
  })
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

3. Display the `requestID` in your UI to allow attendees to complete their payment.

---

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.


---

## Acknowledgments

- [Request Network Documentation](https://docs.request.network/)
- [Ethers.js Library](https://docs.ethers.org/)
- [Node.js Express Framework](https://expressjs.com/)
```
---

