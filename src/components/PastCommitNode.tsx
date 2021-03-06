import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import * as React from 'react';
import { classes } from 'typestyle';
import { GitExtension } from '../model';
import {
  branchesStyle,
  branchStyle,
  collapseStyle,
  localBranchStyle,
  pastCommitBodyStyle,
  pastCommitExpandedStyle,
  pastCommitHeaderItemStyle,
  pastCommitHeaderStyle,
  pastCommitNodeStyle,
  remoteBranchStyle,
  workingBranchStyle
} from '../style/PastCommitNodeStyle';
import { Git } from '../tokens';
import { SinglePastCommitInfo } from './SinglePastCommitInfo';

export interface IPastCommitNodeProps {
  pastCommit: Git.ISingleCommitInfo;
  branches: Git.IBranch[];
  model: GitExtension;
  refreshHistory: () => Promise<void>;
  renderMime: IRenderMimeRegistry;
}

export interface IPastCommitNodeState {
  expanded: boolean;
}

export class PastCommitNode extends React.Component<
  IPastCommitNodeProps,
  IPastCommitNodeState
> {
  constructor(props: IPastCommitNodeProps) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  getBranchesForCommit() {
    const currentCommit = this.props.pastCommit.commit;
    const branches = [];
    for (let i = 0; i < this.props.branches.length; i++) {
      const branch = this.props.branches[i];
      if (branch.top_commit && branch.top_commit === currentCommit) {
        branches.push(branch);
      }
    }
    return branches;
  }

  getNodeClass() {
    if (this.state.expanded) {
      return classes(pastCommitNodeStyle, pastCommitExpandedStyle);
    }
    return pastCommitNodeStyle;
  }

  render() {
    return (
      <li
        onClick={() => {
          this.setState({ expanded: !this.state.expanded });
        }}
        className={this.getNodeClass()}
      >
        <div className={pastCommitHeaderStyle}>
          <div className={pastCommitHeaderItemStyle}>
            {this.props.pastCommit.author}
          </div>
          <div className={pastCommitHeaderItemStyle}>
            {this.props.pastCommit.commit.slice(0, 7)}
          </div>
          <div className={pastCommitHeaderItemStyle}>
            {this.props.pastCommit.date}
          </div>
        </div>
        <div className={branchesStyle}>
          {this.getBranchesForCommit().map(branch => (
            <React.Fragment key={branch.name}>
              {branch.is_current_branch && (
                <span className={classes(branchStyle, workingBranchStyle)}>
                  working
                </span>
              )}
              <span
                className={classes(
                  branchStyle,
                  branch.is_remote_branch ? remoteBranchStyle : localBranchStyle
                )}
              >
                {branch.name}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className={pastCommitBodyStyle}>
          {this.props.pastCommit.commit_msg}
          {this.state.expanded && (
            <React.Fragment>
              <SinglePastCommitInfo
                data={this.props.pastCommit}
                model={this.props.model}
                refreshHistory={this.props.refreshHistory}
                renderMime={this.props.renderMime}
              />
              <div
                className={collapseStyle}
                onClick={() => {
                  this.setState({ expanded: false });
                }}
              >
                Collapse
              </div>
            </React.Fragment>
          )}
        </div>
      </li>
    );
  }
}
