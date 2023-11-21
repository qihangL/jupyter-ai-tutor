
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

/**
 * Make a request to a specific API endpoint.
 *
 * @param endPoint - The API endpoint to target.
 * @param init - Initial settings for the request.
 * @returns A promise resolving to the response data as JSON.
 */
export async function requestAPI<T>(endPoint = '', init: RequestInit = {}): Promise<T> {
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(settings.baseUrl, 'jupyterlab-ai-tutor', endPoint);

  try {
    const response = await ServerConnection.makeRequest(requestUrl, init, settings);
    const data = await response.text();

    if (!response.ok) {
      const errorMessage = data ? JSON.parse(data).message : 'Unknown error';
      throw new ServerConnection.ResponseError(response, errorMessage);
    }

    return data ? JSON.parse(data) : {};
  } catch (error) {
    if (error instanceof Error) {
      console.error('Network error:', error);
      throw new ServerConnection.NetworkError(error);
    }
    throw error; // Re-throw the error if it's not a network error
  }
}

/**
 * Get a response from the chatbot API.
 *
 * @param currentCellJSON - The current cell's JSON data.
 * @param userInput - The user's input to the chatbot.
 * @returns A promise resolving to the chatbot's response.
 */
export async function getChatbotResponse(
  currentCellJSON: any, 
  userInput: string
): Promise<{ success: boolean, response?: string, error?: string }> {
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(settings.baseUrl, 'jupyterlab-ai-tutor', 'get-example');

  const init: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ currentCellJSON, userInput }),
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    const response = await ServerConnection.makeRequest(requestUrl, init, settings);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error making chatbot request:', error);
    throw error; // Re-throw the error for further handling
  }
}
