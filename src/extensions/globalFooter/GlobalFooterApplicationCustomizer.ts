import { override } from '@microsoft/decorators';
import * as React from 'react';
import * as ReactDOM from "react-dom";
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import GlobalFooter from './pages/GlobalFooter';
import PageTitle from './pages/PageTitle';
import { MenuNodeCollection, sp } from "@pnp/sp";

const LOG_SOURCE: string = 'GlobalFooterApplicationCustomizer';
const footerWarpperId = "BCE_DesignSystem_FooterWarpper";
export interface IGlobalFooterApplicationCustomizerProperties {
  navItems: IMSNavItem[];
  pageNavs: IPageNavs;
}
export interface IPageHeadingApplicationCustomizerProperties {
  parentTitle: string;
}
export interface IMSNavItem {
  title: string;
  link: string;
  child: IMSChildNavItem[];
}

export interface IMSChildNavItem {
  title: string;
  link: string;
}

export interface IPageNavs {
  next: string;
  nextTitle: string;
  previous: string;
  previousTitle: string;
}

interface NavigationEventDetails extends Window{
  isNavigatedEventSubscribed : boolean;
}

declare const window : NavigationEventDetails;

export default class GlobalFooterApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalFooterApplicationCustomizerProperties> {
  private _footerPlaceholder: Element | undefined;
  private _navLinks: NodeListOf<Element> | undefined;
  private count: number = 0;
  private _pageHeaderContent: HTMLElement | undefined;
  private _isHomePage: boolean = true;
  private _currentUrl: string;
  private _parentTitle: string;
  private _pageNavs: IPageNavs = { next: "", nextTitle: "", previous: "", previousTitle: "" };
  private _webUrl: string;
  private _navItems: IMSNavItem[] = [];

  @override
  public onInit(): Promise<void> {
    console.log('BCE Design System Branding Footer >> onInit()');
    this._render();
    return Promise.resolve();
  }

  @override
  public onDispose(): Promise<void>{
    this.context.application.navigatedEvent.remove(this, this._render);
    window.isNavigatedEventSubscribed = false;
    return Promise.resolve();
  }

  private _render(){
    sp.setup({
      spfxContext: this.context
    });
    if (!window.isNavigatedEventSubscribed){
      this.context.application.navigatedEvent.add(this, (eventArgs: any) => {
        console.log('BCE Design System Branding Page Title>> this.context.application.navigatedEvent');
        this._isHomePage = this.context.pageContext.legacyPageContext.isWebWelcomePage;
        this._currentUrl = this.context.pageContext.legacyPageContext.serverRequestPath;
        this._webUrl = this.context.pageContext.legacyPageContext.webAbsoluteUrl;
        if (window.isNavigatedEventSubscribed){
          window.location.href = this._webUrl + this._currentUrl;
        }

        this._pageContainerReady().then(() => {
          console.log('BCE Design System Branding Page Title>> _renderCompoments');
          this._renderCompoments();
        });
        window.isNavigatedEventSubscribed = true;
      });
    }
  }

  private _leftNavSelected() : void{
    console.log('BCE Design System Branding Page Title>> Expand Left Navs');
    let navButtons = document.querySelectorAll('.ms-Nav .ms-Nav-compositeLink:not(.is-expanded) button.ms-Nav-link');
    if (navButtons && navButtons.length > 0){
      console.log('BCE Design System Branding Page Title>> Expanding Left Navs');
      for(var i = 0; i < navButtons.length; i++) {
        (navButtons[i] as HTMLButtonElement).click();
      }
    }
    console.log('BCE Design System Branding Page Title>> Applying left nav selected');
    this._navLinks = document.querySelectorAll('div.ms-Nav-group ul.ms-Nav-navItems li.ms-Nav-navItem ul.ms-Nav-navItems div.ms-Nav-compositeLink');
    if (this._navLinks.length > 0) {
      for (let count in this._navLinks) {
        if(this._navLinks[count].classList && this._navLinks[count].classList.length > 0){
          this._navLinks[count].classList.remove("is-selected");
        }
      }
      for (let index in this._navLinks) {
        let aTag = this._navLinks[index].firstElementChild as HTMLAnchorElement;
        if (aTag && aTag.href && aTag.href.toLocaleLowerCase().indexOf(this._currentUrl.toLocaleLowerCase()) > -1){
          this._navLinks[index].classList.add("is-selected");
        }
      }
    }
  }

  private _pageContainerReady(): Promise<void> {
    const checking = (resolve: any, reject: any) => {
      //this._footerPlaceholder = document.querySelector("[class^=pageContainer_]");
      this._footerPlaceholder = document.querySelector("[class^=canvasWrapper_");
      if (this._footerPlaceholder) {
        resolve();
      } else if (this.count < 60) {
        setTimeout(checking.bind(null, resolve, reject), 100);
      } else {
        reject();
      }
      this.count++;
    };
    return new Promise(checking);
  }

  private _renderCompoments(): void {
    try {
      this._pageHeaderReady().then(() => {
        sp.navigation.getMenuState(null, 5, "CurrentNavSiteMapProviderNoEncode").then(root => {
          this._generateFooterNavs(root);
          this._ensureNodeHeading();
          this._leftNavSelected();
          if(this._currentUrl.toLocaleLowerCase().indexOf('/sitepages/home.aspx') > -1){
            (document.querySelector("[class^='globalFooterNavigation_']") as HTMLElement).style.display = "none";
          }
        }).catch(console.error);
      });
    } catch (e) {
      console.error('Fail to inject global identity');
    }
  }

  private _generateFooterNavs(root: MenuNodeCollection) {
    root.Nodes.map((nodes: any, index) => {
      if (nodes.Nodes) {
        let childNodes : IMSChildNavItem[]  = [];
        nodes.Nodes.map((subNode: any, i) => {
          childNodes.push({title: subNode.Title, link: subNode.Key});
          if (subNode.Key === this._currentUrl) {
            this._parentTitle = nodes.Title;
            if (i === 0) {
              console.log('BCE Design System Branding Page Title>> Setting previous button');
              //First of current node, find previous node.
              if (index === 0) {
                this._pageNavs.previous = this._webUrl;
                this._pageNavs.previousTitle = "Home";
              } else {
                let previousParentNode = root.Nodes[index - 1];
                this._pageNavs.previous = previousParentNode.Nodes[previousParentNode.Nodes.length - 1].Key;
                this._pageNavs.previousTitle = previousParentNode.Nodes[previousParentNode.Nodes.length - 1].Title;
              }
            } else {
              this._pageNavs.previous = nodes.Nodes[i - 1].Key;
              this._pageNavs.previousTitle = nodes.Nodes[i - 1].Title;
            }
            console.log('BCE Design System Branding Page Title>> Setting next button');
            if (i + 1 === nodes.Nodes.length) {
              //End of current node, find next node.
              if (index + 1 < root.Nodes.length) {
                this._pageNavs.next = root.Nodes[index + 1].Nodes[0].Key;
                this._pageNavs.nextTitle = root.Nodes[index + 1].Nodes[0].Title;
              }else{
                this._pageNavs.next = "/SitePages/Home.aspx";
                this._pageNavs.nextTitle = "Home";
              }
            }else{
              this._pageNavs.next =nodes.Nodes[i + 1].Key;
              this._pageNavs.nextTitle = nodes.Nodes[i+ 1].Title;
            }
          }
        });
        this._navItems.push({ title: nodes.Title, link: nodes.Nodes[0].Key, child: childNodes });
      }
    });
    this._renderGlobalFooter();
  }

  private _renderGlobalFooter(): void {
    try {
      if(this._navItems && this._navItems.length > 0 && document.getElementById(footerWarpperId) === null){
        const element: React.ReactElement<IGlobalFooterApplicationCustomizerProperties> = React.createElement(GlobalFooter, { navItems: this._navItems, pageNavs: this._pageNavs });
        const footerWarpper = document.createElement('div');
        footerWarpper.id = footerWarpperId;
        this._footerPlaceholder.appendChild(footerWarpper);
        ReactDOM.render(element, document.getElementById(footerWarpperId));
      }
    } catch (e) {
      console.error('Fail to inject global footer');
    }
  }

  private _ensureNodeHeading() {
    //this adds Parent Node title to the top Heading
    if (!this._isHomePage) {
      const headingDiv = document.getElementById("bce-parent-title") as HTMLElement;
      if (!headingDiv) {
        const element: React.ReactElement<IPageHeadingApplicationCustomizerProperties> = React.createElement(PageTitle, { parentTitle: this._parentTitle });
        const parentTitleDiv = document.createElement('div');
        parentTitleDiv.id = "bce-parent-title";
        this._pageHeaderContent.insertBefore(parentTitleDiv, this._pageHeaderContent.firstChild);
        ReactDOM.render(element, document.getElementById("bce-parent-title"));
      } else {
        let heading = headingDiv.firstElementChild.innerHTML;
        if (heading !== this._parentTitle) {
          headingDiv.firstElementChild.innerHTML = this._parentTitle;
        }
      }
    }
  }

  private _pageHeaderReady(): Promise<void> {
    const checking = (resolve: any, reject: any) => {
      let contentPageContent = document.querySelector('[data-automation-id="pageHeader"] [class*="content"]') as HTMLElement;
      let homePageContent = document.querySelector('[class*="canvasWrapper_"]') as HTMLElement;
      let navButtons = document.querySelectorAll('.ms-Nav .ms-Nav-compositeLink:not(.is-expanded) button.ms-Nav-link');
      if (this._isHomePage && navButtons.length === 6) {
        if (homePageContent) {
          this._pageHeaderContent = homePageContent;
          resolve();
        } else if (this.count < 60) {
          setTimeout(checking.bind(null, resolve, reject), 100);
        } else {
          reject();
        }
        this.count++;
      } else {
        if (contentPageContent && navButtons.length === 6) {
          this._pageHeaderContent = contentPageContent;
          resolve();
        } else if (this.count < 60) {
          setTimeout(checking.bind(null, resolve, reject), 100);
        } else {
          reject();
        }
        this.count++;
      }

    };
    return new Promise(checking);
  }
}
