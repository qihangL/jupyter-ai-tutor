
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

/**
 * Retrieves the JSON representation of the current active cell in a JupyterLab notebook.
 *
 * @param notebookTracker The notebook tracker to get the current active notebook and cell.
 * @returns A JSON string representing the current cell, or an empty JSON object if no cell is active.
 */
export function getCurrentCellJSON(notebookTracker: INotebookTracker): string {
  const activeNotebook: NotebookPanel | null = notebookTracker.currentWidget;

  if (!activeNotebook) {
    console.warn('No active notebook found.');
    return "{}"; // Return an empty JSON object if no notebook is active
  }

  const activeCell = activeNotebook.content.activeCell;
  if (!activeCell) {
    console.warn('No active cell found in the current notebook.');
    return "{}"; // Return an empty JSON object if no cell is active
  }

  // Serialize the cell model to JSON
  const cellModelJSON = activeCell.model.toJSON();
  return JSON.stringify(cellModelJSON);
}
