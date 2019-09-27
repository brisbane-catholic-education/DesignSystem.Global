import * as React from 'react';
import styles from '../GlobalFooter.module.scss';
import { IPageHeadingApplicationCustomizerProperties } from '../GlobalFooterApplicationCustomizer';

export default class PageTitle extends React.Component<IPageHeadingApplicationCustomizerProperties> {
    public render(): React.ReactElement<IPageHeadingApplicationCustomizerProperties> {
        return (
          <span className={styles.bceDesignSystemPageParentTitle}>
            {this.props.parentTitle}
          </span>
        );
      }
}