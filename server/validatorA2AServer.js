import express from "express";
import { DefaultRequestHandler, InMemoryTaskStore } from "@a2a-js/sdk/server";
import {
  agentCardHandler,
  jsonRpcHandler,
  UserBuilder,
} from "@a2a-js/sdk/server/express";

import { ValidatorA2AExecutor } from "./agents/validatorA2AExecutor.js";

const app = express();
const PORT = 3003;

// A2A Agent Card
const agentCard = {
  name: "Customer Validator Agent",
  description: "Validates customer data returned by the Search Agent.",
  supportedInterfaces: [
    {
      url: `http://localhost:${PORT}/a2a`,
      protocolBinding: "JSONRPC",
      protocolVersion: "1.0",
    },
  ],
  provider: undefined,
  version: "1.0.0",
  capabilities: {
    streaming: false,
    pushNotifications: false,
    extensions: [],
  },
  securitySchemes: {},
  securityRequirements: [],
  defaultInputModes: ["text/plain"],
  defaultOutputModes: ["text/plain"],
  skills: [
    {
      id: "validate_customers",
      name: "Validate Customers",
      description: "Validates customer IDs and names.",
      tags: ["validation", "customer"],
      examples: ['{"customers":[{"id":"C001","name":"田中太郎"}]}'],
    },
  ],
  signatures: [],
};
console.log(
  "[A2A Server] Executor:",
  typeof ValidatorA2AExecutor.prototype.execute,
);
// A2A 요청 처리기
const requestHandler = new DefaultRequestHandler(
  agentCard,
  new InMemoryTaskStore(),
  new ValidatorA2AExecutor(),
);

// Agent Card 공개
app.use(
  "/.well-known/agent-card.json",
  agentCardHandler({ agentCardProvider: requestHandler }),
);

// A2A JSON-RPC 엔드포인트
app.use(
  "/a2a",
  express.json(),
  jsonRpcHandler({
    requestHandler,
    userBuilder: UserBuilder.noAuthentication,
  }),
);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Validator A2A Server running at http://localhost:${PORT}`);
});
