import * as React from 'react';
import styles from '../ScrollToSection.module.scss';
import { Link } from 'office-ui-fabric-react';
import { IScrollToSectionApplicationCustomizerProperties } from '../ScrollToSectionApplicationCustomizer';

export default class ScrollToSection extends React.Component<IScrollToSectionApplicationCustomizerProperties> {
    private _container: HTMLElement | undefined;
    public render(): React.ReactElement<IScrollToSectionApplicationCustomizerProperties> {
        return (
            <div className={styles.bceDesignSystemScrollToSection}>
                {this.props.headings.length > 0 ? this.props.headings.map((button, index) => 
                    <Link onClick={() => this.scrollTo(button.position)} >{button.title}</Link>
                ) : <span></span>}
            </div>
        );
      }

      private scrollTo(pos: number){
        if (!isNaN(pos) && pos > 0 ){
            if (!this._container ) {
                this._container = document.querySelector('[class*="pageContainer"] [class*="scrollRegion"]') as HTMLElement;
            }
            this._container.scrollTo(0, pos);
        }
     }
}