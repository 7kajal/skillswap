import mongoose from "mongoose";
import { ChatRoomSchema, ChatMessageSchema } from "./schema";
import type { IChatRoom, IChatMessage } from "./types";

export const ChatRoom = mongoose.models.ChatRoom || mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
export const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
