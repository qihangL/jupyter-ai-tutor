import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

export function getCurrentCellJSON(notebookTracker: INotebookTracker): string {
  const activeNotebook: NotebookPanel | null = notebookTracker.currentWidget;
  if (activeNotebook) {
    const activeCell = activeNotebook.content.activeCell;
    if (activeCell) {
      // Serialize the cell model to JSON
      const cellModelJSON = activeCell.model.toJSON();
      return JSON.stringify(cellModelJSON);
    }
  }
  return "{}"; // Return an empty JSON object if no cell is active
}
