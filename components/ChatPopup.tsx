"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HiChatBubbleOvalLeftEllipsis, HiPaperAirplane } from "react-icons/hi2";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ChatPopup() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">('idle');
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isLoaded, user } = useUser();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setStatus("submitted")
    e.preventDefault();

    try {
        if (input?.trim()) {
          const userMessage = { role: 'user', content: input };

          setMessages((prevMessages) => [...prevMessages, userMessage]);

          const response = await fetch(`/api/chat`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  messages: [...messages, userMessage],
              }),
          });

          const data = await response.json();
          console.log(data);

          setMessages((prevMessages) => [...prevMessages, { role: 'AI', content: data.response }]);
          setInput('');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setStatus('idle');
    }
  };


  return (
    <div className="fixed bottom-6 right-6 z-50 h-auto">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="p-2 rounded-md hover:rounded-xl bg-[#2A254B] hover:bg-[#363061] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <HiChatBubbleOvalLeftEllipsis className="w-8 h-8 text-white" />
          </button>
        </DialogTrigger>

        <DialogContent
          className="fixed bottom-20 right-6 w-auto h-[600px] p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-white"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          {/* Header */}
          <DialogHeader className="flex items-center justify-between p-4 bg-[#2A254B] text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <HiChatBubbleOvalLeftEllipsis className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Customer Support
                </DialogTitle>
                <p className="text-sm text-white/80">We&apos;re here to help!</p>
              </div>
            </div>
          </DialogHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 h-[360px] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <HiChatBubbleOvalLeftEllipsis className="w-8 h-8 text-[#2A254B]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Welcome to our store!
                  </h3>
                  <p className="text-sm text-gray-600">
                    How can we help you today?
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={`${message.content}-${index}`}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    message.role === "user"
                      ? "ml-auto flex-row-reverse"
                      : "mr-auto"
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {message.role === "user" ? (
                      isLoaded && user?.imageUrl ? (
                        <AvatarImage src={user?.imageUrl} />
                      ) : (
                        <AvatarFallback>you</AvatarFallback>
                      )
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-teal-800 via-teal-500 to-[#373069] text-white rounded-full">AI</AvatarFallback>
                    )}
                  </Avatar>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-full break-words",
                      message.role === "user"
                        ? "bg-[#373069] text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    )}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {status === "submitted" && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    AI
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <DialogFooter className="p-4 border-t bg-gray-50">
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center gap-2"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500"
                disabled={status === "streaming"}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || status === "streaming" || status === "submitted"}
                className="rounded-full bg-[#2A254B] shadow-md hover:bg-[#373069] px-4"
              >
                <HiPaperAirplane className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI • We typically reply instantly
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
