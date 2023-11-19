// src/index.ts

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';
import { MainAreaWidget, ICommandPalette, ToolbarButton } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { reactIcon } from '@jupyterlab/ui-components';
import { ChatbotWidget } from './ChatbotComponent';

namespace CommandIDs {
  export const openChatbot = 'open-chatbot-widget';
}

let chatbotWidget: MainAreaWidget<ChatbotWidget> | null = null;  // Global reference for the chatbot widget

const extension: JupyterFrontEndPlugin<void> = {
  id: 'react-widget',
  description: 'A JupyterLab extension with a chatbot widget.',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker, ILayoutRestorer],
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, notebooks: INotebookTracker, restorer: ILayoutRestorer) => {
    const command = CommandIDs.openChatbot;
    app.commands.addCommand(command, {
      label: 'Open Chatbot',
      execute: () => {
        if (!chatbotWidget || !chatbotWidget.isAttached) {
          const content = new ChatbotWidget(notebooks);
          chatbotWidget = new MainAreaWidget<ChatbotWidget>({ content });
          chatbotWidget.title.label = 'Chatbot';
          chatbotWidget.title.icon = reactIcon;
        }
    
        if (!chatbotWidget.isAttached) {
          const currentWidget = app.shell.currentWidget;
          if (currentWidget) {
            app.shell.add(chatbotWidget, 'main', { mode: 'split-right', ref: currentWidget.id });
          } else {
            app.shell.add(chatbotWidget, 'main');
          }
        } else {
          app.shell.activateById(chatbotWidget.id);  // Focus the existing widget
        }
      }
    });
    

    // Add the command to the palette
    palette.addItem({ command, category: 'Chatbot' });

    // Add a button to the notebook toolbar
    notebooks.widgetAdded.connect((sender, panel: NotebookPanel) => {
      const button = new ToolbarButton({
        label: 'Chatbot',
        onClick: () => app.commands.execute(command),
        tooltip: 'Open the Chatbot'
      });

      panel.toolbar.insertItem(10, 'chatbot', button);
    });
  }
};

export default extension;
