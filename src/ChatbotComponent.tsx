import React, { useState } from 'react';
import { ReactWidget } from '@jupyterlab/ui-components';
import { getCurrentCellJSON } from './utils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { getChatbotResponse } from './handler';

import { MarkdownRenderer } from './markdown';
import '../style/index.css'

interface ChatbotComponentProps {
  notebookTracker: INotebookTracker;
}

const ChatbotComponent = ({ notebookTracker }: ChatbotComponentProps): JSX.Element => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Adding loading state
  const defaultQuestion = "Explain the code and output in this cell.";  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state when submitting

    const currentCellJSON = getCurrentCellJSON(notebookTracker);
    const question = userInput.trim() === '' ? defaultQuestion : userInput; 

    try {
      const response = await getChatbotResponse(currentCellJSON, question);
    
      if (response.success) {
        setChatResponse(response.response || "No response provided");  // Provide a default message
      } else {
        setChatResponse("Error: " + (response.error || "Unknown error"));  // Provide a default error message
      }
    } catch (error) {
      setChatResponse("Error sending request: " + (error as Error).message);
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  };

  const responseBoxClass = chatResponse ? "chatbot-response" : "chatbot-response hidden";

  
  return (
    <div className="chatbot-container">
      <div className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder={defaultQuestion}
          className="chatbot-input"
          onKeyDown={handleKeyPress} 
        />
        <button onClick={handleSubmit} disabled={isLoading} className="chatbot-submit">
          {isLoading ? "Thinking" : "Send"}
        </button>
      </div>
      <div className={responseBoxClass}>
        {/* <Markdown>{chatResponse}</Markdown> */}
        <MarkdownRenderer>
          {chatResponse}
        </MarkdownRenderer>
      </div>
    </div>
  );
};

/**
 * A Chatbot Lumino Widget that wraps a ChatbotComponent.
 */
export class ChatbotWidget extends ReactWidget {
  constructor(private notebookTracker: INotebookTracker) {
    super();
    this.addClass('jp-chatbot-widget');
  }

  render(): JSX.Element {
    return <ChatbotComponent notebookTracker={this.notebookTracker} />;
  }
}