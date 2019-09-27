import * as React from 'react';
import styles from '../PageTitle.module.scss';
import { IPageTitleApplicationCustomizerProperties } from '../PageTitleApplicationCustomizer';

export default class PageTitle2 extends React.Component<IPageTitleApplicationCustomizerProperties> {
    public render(): React.ReactElement<IPageTitleApplicationCustomizerProperties> {
        return (
          <span className={styles.bceDesignSystemPageParentTitle}>
            {this.props.parentTitle}
          </span>
        );
      }
}