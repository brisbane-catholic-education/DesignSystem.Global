import * as React from 'react';
import styles from '../ScrollToSection.module.scss';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
export default class ExternalLinksIcon extends React.Component<{text:string}> {

    public render(): React.ReactElement<{text:string}> {
        return (
            <div className={styles.externalLinksIcon}>
                {this.props.text}<IconButton iconProps={{ iconName: 'NavigateExternalInline' }} title='NavigateExternalInline'></IconButton>
            </div>
        );
      }
}