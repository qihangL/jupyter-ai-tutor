
import React, { useState, useRef } from 'react';
import { ReactWidget } from '@jupyterlab/ui-components';
import { getCurrentCellJSON } from './utils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { getChatbotResponse } from './handler';
import { MarkdownRenderer } from './markdown';
import '../style/index.css';

interface ChatbotComponentProps {
  notebookTracker: INotebookTracker;
}

// Input section component
const ChatInput = ({ userInput, setUserInput, handleSubmit, isLoading }: {
  userInput: string,
  setUserInput: (input: string) => void,
  handleSubmit: () => void,
  isLoading: boolean
}) => (
  <div className="chat-input-container">
    <input
      type="text"
      value={userInput}
      onChange={(event) => setUserInput(event.target.value)}
      placeholder="Explain the code and output in this cell."
      className="chatbot-input"
      onKeyDown={(event) => event.key === 'Enter' && handleSubmit()} 
    />
    <button onClick={handleSubmit} disabled={isLoading} className="chatbot-submit">
      {isLoading ? "Thinking" : "Send"}
    </button>
  </div>
);

// Response section component
const ChatResponse = ({ chatResponse }: { chatResponse: string }) => (
  <div className={chatResponse ? "chatbot-response" : "chatbot-response hidden"}>
    <MarkdownRenderer>
      {chatResponse}
    </MarkdownRenderer>
  </div>
);

const ChatbotComponent = ({ notebookTracker }: ChatbotComponentProps): JSX.Element => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatHistoryRef = useRef(''); // Ref to track the chat history
  const handleSubmit = async () => {
    setIsLoading(true);
    const currentCellJSON = getCurrentCellJSON(notebookTracker);
    const question = userInput.trim() === '' ? "Explain the code and output in this cell." : userInput; 

    try {
      const response = await getChatbotResponse(currentCellJSON, question, chatHistoryRef.current);
      if (response.success) {
        setChatResponse(response.response || "No response provided");
        
        chatHistoryRef.current = response.history || "";

      } else {
        setChatResponse("Error: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      setChatResponse("Error sending request: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="chatbot-container">
      <ChatInput userInput={userInput} setUserInput={setUserInput} handleSubmit={handleSubmit} isLoading={isLoading} />
      <ChatResponse chatResponse={chatResponse} />
    </div>
  );
};

export class ChatbotWidget extends ReactWidget {
  constructor(private notebookTracker: INotebookTracker) {
    super();
    this.addClass('jp-chatbot-widget');
  }

  render(): JSX.Element {
    return <ChatbotComponent notebookTracker={this.notebookTracker} />;
  }
}
