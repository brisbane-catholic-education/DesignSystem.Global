import * as React from "react";
import styles from "../GlobalFooter.module.scss";
import { IMSNavItem, IPageNavs } from "../GlobalFooterApplicationCustomizer";
import { IGlobalFooterApplicationCustomizerProperties } from "../GlobalFooterApplicationCustomizer";
import GlobalFooterLinks from "./GlobalFooterLinks";
import { IconButton } from "office-ui-fabric-react";
export default class GlobalFooter extends React.Component<
  IGlobalFooterApplicationCustomizerProperties & {
    navItems: IMSNavItem[];
    pageNavs: IPageNavs;
  }
> {
  public render(): React.ReactElement<IGlobalFooterApplicationCustomizerProperties> {
    return (
      <div className={styles.bceDesignSystemFooter}>
        <div className="ms-Grid">
          <div className={styles.globalFooterNavigation + " ms-Grid-row"}>
            <div className="ms-Grid-col ms-sm6 ms-lg6">
              {this.props.pageNavs.previous ? (
                <a href={this.props.pageNavs.previous}>
                  <IconButton iconProps={{ iconName: "Back" }}></IconButton>
                  {" " + this.props.pageNavs.previousTitle}
                </a>
              ) : (
                <span></span>
              )}
            </div>
            <div className="ms-Grid-col ms-sm6 ms-lg6">
              {this.props.pageNavs.next ? (
                <a href={this.props.pageNavs.next}>
                  {this.props.pageNavs.nextTitle + " "}
                  <IconButton iconProps={{ iconName: "Forward" }}></IconButton>
                </a>
              ) : (
                <span></span>
              )}
            </div>
          </div>

          <div className="container">
            <div className={styles.globalFooterLinksTitle + ' ms-Grid-row'}>
              <div className='ms-Grid-col' >
                <span className={styles.footerTitle}>BCE Design System</span>
              </div>
            </div>
            <GlobalFooterLinks navItems={this.props.navItems} pageNavs={null} />
            </div>

          <div className={styles.globalFooterbar + " ms-Grid-row"}>
            <div className="ms-Grid-col ms-sm12 ms-lg3">
              <span className={styles.footerTitle}>
                <a href="https://mybcecatholicedu.sharepoint.com/SitePages/Home.aspx">
                  Brisbane Catholic Education
                </a>
              </span>
            </div>
            <div className="ms-Grid-col ms-sm12 ms-lg9">
              <span>
                <a href="https://mybcecatholicedu.sharepoint.com/SitePages/Copyright.aspx">
                  Copyright
                </a>
                &nbsp;|&nbsp;
                <a href="https://mybcecatholicedu.sharepoint.com/policies-and-procedures/SitePages/Policy-Privacy.aspx">
                  Privacy policy
                </a>
                &nbsp;|&nbsp;
                <a href="https://www.bne.catholic.edu.au/aboutus/legals/Pages/Acceptable-Use-Policy.aspx">
                Acceptable Use
                </a>
                &nbsp;|&nbsp;
                <a href="https://mybcecatholicedu.sharepoint.com/SitePages/Acknowledgement-of-Country.aspx">
                  Acknowledgement of country
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
