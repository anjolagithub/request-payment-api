const express = require("express");
const cors = require("cors");
const {
  RequestNetwork,
  Types,
  Utils,
} = require("@requestnetwork/request-client.js");
const {
  EthereumPrivateKeySignatureProvider,
} = require("@requestnetwork/epk-signature");
const { config } = require("dotenv");
const { Wallet, utils } = require("ethers");
config();

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin during development
    // In production, replace * with specific allowed origins
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
const payeePK = process.env.PAYEE_PK;

app.post("/create-request", async (req, res) => {
  try {
    const { amount, payerAddress } = req.body;
  
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
  
    const payeeIdentity = new Wallet(payeePK).address;
    const payerIdentity = payerAddress;
    const paymentRecipient = payeeIdentity;
    const feeRecipient = "0x0000000000000000000000000000000000000000";
  
    const requestCreateParameters = {
      requestInfo: {
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: "0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C",
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
        timestamp: Utils.getCurrentTimestampInSecond(),
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
        reason: "ð",
        dueDate: "",
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
    };
  
    const request = await requestClient.createRequest(requestCreateParameters);
    const requestData = await request.waitForConfirmation();
  
    res.status(200).send({
      message: "Request created successfully.",
      requestID: requestData.requestId,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

app.get("/requests/:userAddress", async (req, res) => {
  try {
    const { userAddress: identityAddress } = req.params;
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
    });
    const requests = await requestClient.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: identityAddress,
    });
    const requestDatas = requests.map((request) => request.getData());
    res
      .status(200)
      .send({ message: "Request fetched successfully", data: requestDatas });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
