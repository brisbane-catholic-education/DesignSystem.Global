import * as React from 'react';
import { IGlobalIdentityApplicationCustomizerProperties } from '../GlobalIdentityApplicationCustomizer';
import styles from '../GlobalIdentity.module.scss';

export default class GlobalIdentity extends React.Component<IGlobalIdentityApplicationCustomizerProperties> {
    public render(): React.ReactElement<IGlobalIdentityApplicationCustomizerProperties> {
        return (
          <div className={styles.bceDesignSystemIdentity + ' ' + this.props.class}>
            <a href={this.props.webAbsoluteUrl}>
              <span>Brisbane Catholic Education</span>
              <h3>Design System</h3>
            </a>
          </div>
        );
      }
}
