"use client";

import { ConversationMessage } from "@/types/profile";
import { Conversation } from "../conversation/conversation";

export type ClientConversationProps = {
  conversation: ConversationMessage[];
  id: string;
};

export const ClientConversation = ({
  conversation,
  id,
}: ClientConversationProps) => {
  return <Conversation serverConversation={conversation} id={id} />;
};
