import { ChatComponent } from "@/components/documents/ChatComponent"
import React, { useEffect, useState } from "react";
import { mockChats } from "../documents";
import { Chat } from "@/utils/types";
import { fetchUser } from "@/utils/fetches";
import { fetchDocs } from "@/utils/fetches";
import { User, Message } from "@/utils/types";
import LoginPage from "../auth";

const ChatPage = () => {
  const [user, setUser] = useState<User | null>(null);

  // const [docs, setDocs] = useState<string[]>([]); // names of all documents the user has uploaded
  const [chats, setChats] = useState<Chat[]>([]);


  useEffect(() => {
    // DEV ONLY
    if (process.env.NODE_ENV === "development") { // If in development mode, mock user and chats
      setUser({ // Mock user
        id: "91231123-1230u1u-123132",
        name: "John Doe",
        username: "john@doe.com"
      });
    } else fetchUser(setUser);
    }, []);

  useEffect(() => {
    // if (user) fetchChatsMeta(user).then(setChatsMeta).catch(console.error);
    // if (user && chatsMeta && chatsMeta[0] && chatsMeta[0].id) fetchChatContent(user, chatsMeta[0].id).then(setChatContent).catch(console.error);

    setChats(chats.length == 0 ? [{ // If no chats, create a new chat
      id: "temp",
      title: "New Chat",
      content: []
    }, 
    mockChats[1],
  ] : chats);
  }, [user]);

  const appendMessageToChat = (id: string): string => { // returns message id
    console.log("Appending empty message to chat temp");
    const tempChat = chats.find((chat) => chat.id == "temp");
    setChats(chats.map((chat) => { // // add a new empty message to the chat with the id "temp"
      if (chat.id == "temp") {
        return {
          ...chat,
          content: [{
            id: "temp", // generate a random id
            content: [],
            whoSent: user?.name ?? "John Doe",
            whenSent: new Date()
          }]
        };
      } else {
        return chat;
      }
    }));
    return "temp";
  }

  const appendContentToMessageInChat = (chatId: string, messageId: string, content: string) => {
    console.log(`Appending content to message in chat ${chatId} with message id ${messageId}`);
    console.log("Content: " + content);
    setChats(chats.map((chat) => { // add content to 
      if (chat.id === chatId) {
        return {
          ...chat,
          content: [
            ...(chat.content == null ? [] : chat.content.filter((message) => message.id != messageId)),
            {
              id: messageId,
              content: content.split("\n"),
              whoSent: user?.name ?? "John Doe",
              whenSent: new Date()
            }]
        };
      } else {
        return chat;
      }
    }));
  }

  const onNewChatClicked = () => {
    console.log("New chat clicked");
    setChats([{ "content": [], "id": "temp", "title": "New Chat" }, ...chats])
  }

  return (
    <main className="overflow-hidden">
      {!user && <LoginPage />}
      {user && <ChatComponent
        chats={chats}
        onNewChatClicked={onNewChatClicked}
        onChatSubmitted={(chatId: string) => {
          console.log("Chat submitted " + chatId + " for user " + user?.username);
        }}
        appendContentToMessageInChat={appendContentToMessageInChat}
        appendMessageToChat={appendMessageToChat}
      />}
    </main>
  )
}

export default ChatPage;