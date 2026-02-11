import { ConversationMessage } from "@/types/profile";
import { Message } from "@chatscope/chat-ui-kit-react";
import "./conversation-message.css";

export type ConversationMessageProps = {
  message: ConversationMessage;
  showTranslation?: boolean;
};

export default function ConversationMessageComponent({
  message,
  showTranslation = true,
}: ConversationMessageProps) {
  const isCaller = message.whichParty === "caller";

  return (
    <Message
      model={{
        direction: isCaller ? "incoming" : "outgoing",
        position: "single",
      }}>
      <Message.CustomContent>
        <div style={{ marginBottom: "0.5rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              opacity: 0.7,
              marginBottom: "0.25rem",
            }}>
            Original ({message.originalLanguageCode})
          </div>
          <div style={{ fontSize: "1rem" }}>{message.original}</div>
        </div>
        {showTranslation && message.translated && (
          <div
            style={{
              paddingTop: "0.5rem",
              borderTop: "1px solid currentColor",
              opacity: 0.85,
            }}>
            <div
              style={{
                fontSize: "0.75rem",
                opacity: 0.7,
                marginBottom: "0.25rem",
              }}>
              Translated ({message.translatedLanguageCode})
            </div>
            <div style={{ fontStyle: "italic" }}>{message.translated}</div>
          </div>
        )}
      </Message.CustomContent>
      <Message.Footer>
        {new Date(message.timestamp).toLocaleTimeString()}
      </Message.Footer>
    </Message>
  );
}
