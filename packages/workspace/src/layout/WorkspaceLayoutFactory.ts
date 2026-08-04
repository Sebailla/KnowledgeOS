import type { WorkspaceLayout } from "../model/WorkspaceLayout.js";
import type { WorkspacePanel } from "../model/WorkspacePanel.js";
import type { WorkspaceTab } from "../model/WorkspaceTab.js";

export function createSinglePanelLayout(
  panel: WorkspacePanel,
): WorkspaceLayout {
  const tab: WorkspaceTab = {
    id: `tab:${panel.id}`,
    title: panel.title,
    panel,
    pinned: false,
  };

  return {
    root: {
      kind: "leaf",
      id: "leaf:root",
      tabs: [tab],
      activeTabId: tab.id,
    },
    focusedPanelId: panel.id,
  };
}
