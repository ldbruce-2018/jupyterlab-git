import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import * as React from 'react';
import { GitExtension } from '../model';
import { historySideBarStyle } from '../style/HistorySideBarStyle';
import { Git } from '../tokens';
import { PastCommitNode } from './PastCommitNode';

/** Interface for WorkingFolder component props */
export interface IHistorySideBarProps {
  pastCommits: Git.ISingleCommitInfo[];
  branches: Git.IBranch[];
  model: GitExtension;
  refreshHistory: () => Promise<void>;
  renderMime: IRenderMimeRegistry;
}

export const HistorySideBar: React.FunctionComponent<IHistorySideBarProps> = (
  props: IHistorySideBarProps
) => (
  <ol className={historySideBarStyle}>
    {props.pastCommits.map((pastCommit: Git.ISingleCommitInfo) => (
      <PastCommitNode
        key={pastCommit.commit}
        pastCommit={pastCommit}
        branches={props.branches}
        model={props.model}
        refreshHistory={props.refreshHistory}
        renderMime={props.renderMime}
      />
    ))}
  </ol>
);
