import * as React from 'react';
import { Link} from 'office-ui-fabric-react';
import { IGlobalFooterApplicationCustomizerProperties, IMSNavItem } from '../GlobalFooterApplicationCustomizer';
import styles from '../GlobalFooter.module.scss';

export default class GlobalFooterLinks extends React.Component<IGlobalFooterApplicationCustomizerProperties> {
    public render(): React.ReactElement<IGlobalFooterApplicationCustomizerProperties> {
        return (
          <div className={styles.globalFooterLinks + ' ms-Grid-row'}>
             {this.props.navItems.map((item, index)=>
                 <div className='ms-Grid-col ms-sm12 ms-md6 ms-xl3' >
                          <span>
                            <a href={item.link}>{item.title}</a>
                          </span>
                </div>
              )}
          </div>
        );
      }
}
