---

# Quiktis Request Network Integration

## Overview

This repository contains a server-side implementation for integrating the **Request Network** into the Quiktis platform. The integration leverages the **Request Client SDK** to create and manage payment requests, enabling seamless and transparent transactions between users.

This implementation is designed to work on the **Sepolia testnet** with support for ERC-20 tokens. It eliminates the need for custom smart contract development by utilizing the pre-built infrastructure of the Request Network.

---

## Features

- **Payment Requests**: Generate ERC-20 payment requests using the Request Network's client SDK.
- **Sepolia Testnet Support**: Works seamlessly with the Sepolia testnet.
- **Fee-less Transactions**: Set up requests without additional fees.
- **Secure Identity**: Uses Ethereum-based private key signatures for secure transactions.
- **Scalable API**: Provides RESTful API endpoints for payment integration.

---

## Installation

### Prerequisites

Ensure the following are installed on your system:
- [Node.js](https://nodejs.org/) (v16 or later)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A Sepolia testnet wallet with:
  - A private key (for the payee).
  - Access to Sepolia ETH and relevant ERC-20 tokens.

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

Create a `.env` file in the project root directory with the following variables:

```env
PORT=3000
PAYEE_PK=YOUR_PRIVATE_KEY
```

- **PORT**: The port number on which the server will run.
- **PAYEE_PK**: The private key of the payee's Ethereum wallet. This is used to sign requests.

> ⚠️ **Warning**: Keep your private key secure and do not share it with anyone.

---

## Usage

### Starting the Server

Start the server using the following command:

```bash
npm start
```

By default, the server will run on `http://localhost:3000`.

---

## API Endpoints

### 1. **Create Payment Request**

**URL**: `/create-request`  
**Method**: `GET`  
**Request Body**:  
- `amount` (string): The payment amount (in token units).
- `payerAddress` (string): The Ethereum address of the payer.

**Example Request**:

```json
{
  "amount": "100",
  "payerAddress": "0xPAYER_ADDRESS_HERE"
}
```

**Response**:

- **Success (200)**:
  ```json
  {
    "message": "Request created successfully.",
    "requestID": "0xREQUEST_ID"
  }
  ```

- **Error**:
  ```json
  {
    "error": "Error message here."
  }
  ```

---

## Code Explanation

### Core Logic

- **Request Initialization**:
  ```javascript
  const epkSignatureProvider = new EthereumPrivateKeySignatureProvider({
    method: Types.Signature.METHOD.ECDSA,
    privateKey: payeePK,
  });

  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network/",
    },
    signatureProvider: epkSignatureProvider,
  });
  ```

  Initializes the Request Client SDK with a private key-based signature provider and connects to the Sepolia testnet.

- **Request Parameters**:
  ```javascript
  const requestCreateParameters = {
    requestInfo: {
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C", // Sepolia ERC-20 Token
        network: "sepolia",
      },
      expectedAmount: utils.parseUnits(amount, 18).toString(),
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: "sepolia",
        paymentAddress: paymentRecipient,
        feeAddress: feeRecipient,
        feeAmount: "0",
      },
    },
    contentData: {
      reason: "Payment request",
      dueDate: "",
    },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
  };
  ```

  Defines the parameters for creating an ERC-20 payment request.

- **Request Creation**:
  ```javascript
  const request = await requestClient.createRequest(requestCreateParameters);
  const requestData = await request.waitForConfirmation();
  ```

  Creates the request and waits for its confirmation.

---

## Frontend Integration

To integrate this server with a frontend:
1. Create a form to capture `amount` and `payerAddress`.
2. Send a request to the `/create-request` endpoint.
3. Display the `requestID` or any relevant data returned by the API.

---

## Contributing

Contributions are welcome! Please fork the repository, make changes, and submit a pull request. 

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- [Request Network Documentation](https://docs.request.network/)
- [Ethers.js Library](https://docs.ethers.org/)
- [Node.js Express Framework](https://expressjs.com/)

---

