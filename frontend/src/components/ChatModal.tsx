import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MarkdownRenderer from "./AIMessageHandler";
interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatModalProps {
  stackId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal = ({ stackId, isOpen, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl =
    import.meta.env.local.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/v1/stacks/${stackId}/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from the stack.");
      }

      const result = await response.json();
      const aiMessage: Message = { sender: "ai", text: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        sender: "ai",
        text: "Sorry, something went wrong.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img className="w-7 h-7" src="/icon.png" alt="Logo" />
            GenAI Stack Chat
          </DialogTitle>
        </DialogHeader>

        {/* Chat body */}
        <div className="flex-grow p-6 flex flex-col gap-6">
          {messages.length ? (
            <>
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start gap-3">
                  {msg.sender === "ai" ? (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="rounded-lg p-3 bg-gray-50 text-black w-full">
                    {msg.sender === "user" ? (
                      <p className="text-sm">{msg.text}</p>
                    ) : (
                      <MarkdownRenderer rawMarkdown={msg.text} />
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gray-50 text-black">
                    <p className="text-sm">Generating Response...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center flex-grow text-center gap-2">
              <div className="flex items-center font-bold gap-2 p-4"><img className="w-7 h-7" src="/icon.png" alt="Logo" /> GenAI Stack Chat</div>
              <p className="text-sm text-gray-500">Start a conversation with your stack.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="w-full flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
};
