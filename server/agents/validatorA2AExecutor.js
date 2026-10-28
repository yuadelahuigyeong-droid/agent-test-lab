import { validateCustomers } from "./validatorAgent.js";

export class ValidatorA2AExecutor {
  async execute(requestContext, eventBus) {
    console.log("[A2A Executor] execute() called");

    try {
      const message = requestContext.userMessage;
      console.log("[A2A Executor] Message:", JSON.stringify(message, null, 2));

      // A2A 메시지의 첫 번째 텍스트 파트에서 JSON 데이터 추출
      const textPart = message.parts.find(
        (part) => part.content?.$case === "text",
      );
      if (!textPart) {
        throw new Error("Text message is required");
      }

      const { customers } = JSON.parse(textPart.content.value);

      // 기존 Validator Agent의 검증 로직 재사용
      const isValid = validateCustomers(customers);
      console.log("[A2A Executor] Publishing response:", isValid);

      // A2A 메시지로 검증 결과 반환
      eventBus.publish({
        kind: "message",
        data: {
          messageId: crypto.randomUUID(),
          role: 2, // ROLE_AGENT
          contextId: requestContext.contextId,
          parts: [
            {
              content: {
                $case: "text",
                value: JSON.stringify({ isValid }),
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("[A2A Executor] Error:", error);
      eventBus.publish({
        kind: "message",
        messageId: crypto.randomUUID(),
        role: 2, // ROLE_AGENT
        contextId: requestContext.contextId,
        parts: [
          {
            kind: "text",
            text: JSON.stringify({
              isValid: false,
              error: error.message,
            }),
          },
        ],
      });
    } finally {
      eventBus.finished();
    }
  }

  async cancelTask() {
    throw new Error("Task cancellation is not supported");
  }
}
