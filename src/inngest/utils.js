export function lastAssistantTextMessageContent(result) {
    if (!result?.output || !Array.isArray(result.output)) return undefined;
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant"
    )
    const message = result.output[lastAssistantTextMessageIndex]
    return message?.content ? typeof message.content === "string" ? message.content : message.content.map((part) => part.text).join("") : undefined
}