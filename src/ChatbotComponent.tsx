// src/ChatbotComponent.tsx

import React, { useState } from 'react';
import { ReactWidget } from '@jupyterlab/ui-components';
import { getCurrentCellJSON } from './utils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { getChatbotResponse } from './handler';

interface ChatbotComponentProps {
  notebookTracker: INotebookTracker;
}

const ChatbotComponent = ({ notebookTracker }: ChatbotComponentProps): JSX.Element => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    setChatResponse("Loading..."); // Optional: set a loading state
    const currentCellJSON = getCurrentCellJSON(notebookTracker);

    try {
      const response = await getChatbotResponse(currentCellJSON, userInput);
    
      if (response.success) {
        setChatResponse(response.response || "No response provided");  // Provide a default message
      } else {
        setChatResponse("Error: " + (response.error || "Unknown error"));  // Provide a default error message
      }
    } catch (error) {
      setChatResponse("Error sending request: " + (error as Error).message);
    }
    

  };
  

  return (
    <div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Ask</button>
      <div>
        {chatResponse}
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
