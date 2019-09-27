import { override } from '@microsoft/decorators';
import * as React from 'react';
import * as ReactDOM from "react-dom";
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import GlobalFooter from './pages/GlobalFooter';
import PageTitle from './pages/PageTitle';
import { sp } from "@pnp/sp";

const LOG_SOURCE: string = 'GlobalFooterApplicationCustomizer';
const footerWarpperId = "BCE_DesignSystem_FooterWarpper";
export interface IGlobalFooterApplicationCustomizerProperties {
  navItems: IMSNavItem[];
  pageNavs: IPageNavs;
}
export interface IPageHeadingApplicationCustomizerProperties {
  parentTitle: string;
}
export interface IMSNavItem{
  title: string;
  link: string;
}
export interface IPageNavs{
  next: string;
  nextTitle: string;
  previous: string;
  previousTitle: string;
}

export default class GlobalFooterApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalFooterApplicationCustomizerProperties> {
  private _footerPlaceholder: Element | undefined;
  private _msNavItems : NodeListOf<Element>| undefined;
  private count: number = 0;
  private navCount: number = 0;
  private _pageHeaderContent: HTMLElement | undefined;
  private _compositeHeader: HTMLElement | undefined;
  private _isHomePage : boolean = true;
  private _currentUrl: string;
  private _parentTitle: string;
  private _pageNavs: IPageNavs = {next: "",nextTitle: "", previous: "", previousTitle: ""};
  private _webUrl: string;
  private _title: HTMLElement | undefined;

  @override
  public onInit(): Promise<void> {
    console.log('BCE Design System Branding Footer >> onInit()');
    sp.setup({
      spfxContext: this.context
    });
    this.context.application.navigatedEvent.add(this, (eventArgs: any) => {
      console.log('BCE Design System Branding Page Title>> this.context.application.navigatedEvent');
      this._isHomePage = this.context.pageContext.legacyPageContext.isWebWelcomePage;
      this._currentUrl = this.context.pageContext.legacyPageContext.serverRequestPath;
      this._webUrl = this.context.pageContext.legacyPageContext.webAbsoluteUrl;
      this._renderPageHeading();
    });
    return Promise.resolve();
  }

  private _renderGlobalFooter(): void {
    try{
      this._pageContainerReady().then(() => {
        this._getMSNavItems().then((items) => {
          const element: React.ReactElement<IGlobalFooterApplicationCustomizerProperties> = React.createElement(GlobalFooter, {navItems: items, pageNavs: this._pageNavs});
          const footerWarpper = document.createElement('div');
          footerWarpper.id = footerWarpperId;
          this._footerPlaceholder.appendChild(footerWarpper);
          ReactDOM.render(element,  document.getElementById(footerWarpperId));
        }).catch(()=>{
          console.error('The expected MS Navigation List Items was not found.');
        });
      })
      .catch(() =>{
        console.error('The expected homepageContainer was not found.');
      });
 
    }catch(e){
      console.error('Fail to inject global footer');
    }
  }  
    
  private _getMSNavItems(): Promise<IMSNavItem[]>{
    const checking = (resolve: any, reject: any) => {
      this._msNavItems = document.querySelectorAll('button.ms-Nav-link .ms-Nav-linkText');
      if (this._msNavItems && this._msNavItems[0] && this._msNavItems[0].innerHTML !== "Loading...") {
        let items: IMSNavItem[] = [];
        const array = Array.prototype.slice.call(this._msNavItems);
        array.map((item:any, index)=>{
          items.push({title: item.innerHTML, link: item.href});
        });
        resolve(items);
      } else if(this.navCount < 120) {
        setTimeout(checking.bind(null, resolve, reject), 200);
      } else {
        reject();
      }
      this.navCount++;
    };
    return new Promise(checking);
  }
  
  private _pageContainerReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      //this._footerPlaceholder = document.querySelector("[class^=pageContainer_]");
      this._footerPlaceholder = document.querySelector("[class^=canvasWrapper_");
      if (this._footerPlaceholder) {
        resolve();
      } else if(this.count < 60) {
        setTimeout(checking.bind(null, resolve, reject), 100);
      } else {
        reject();
      }
      this.count++;
    };
    return new Promise(checking);
  }

  private _renderPageHeading(): void {
    try{
      this._pageHeaderReady().then(() => {
       // this._compositeHeader.style.display = "none";
        if(this._isHomePage){
          
        }else{
          sp.navigation.getMenuState(null, 5, "CurrentNavSiteMapProviderNoEncode").then(root => {
            root.Nodes.map((nodes:any, index)=>{
              if(nodes.Nodes){
                nodes.Nodes.map((subNodes: any, i)=>{
                  if(subNodes.Key === this._currentUrl){
                    this._parentTitle = nodes.Title;
                    if(i === 0){
                      this._pageNavs.previous = this._webUrl;
                      this._pageNavs.previousTitle = "Home";
                    }else{
                      this._pageNavs.previous = nodes.Nodes[i - 1].Key;
                      this._pageNavs.previousTitle = nodes.Nodes[i - 1].Title;
                    }
                    if(i + 1 === nodes.Nodes.length){
                      this._pageNavs.next = "";
                      this._pageNavs.nextTitle = "";
                      return;
                    }
                    this._pageNavs.next = nodes.Nodes[i + 1].Key;
                    this._pageNavs.nextTitle = nodes.Nodes[i + 1].Title;
                    return;
                  }
                });
              }    
            });
          this._ensureNodeHeading();
          this._renderGlobalFooter();
        }).catch(console.error);
        }
      });
    }catch(e){
      console.error('Fail to inject global identity');
    }
  }

  private _ensureNodeHeading() {
    const headingDiv = document.getElementById("bce-parent-title") as HTMLElement;
    if(!headingDiv){
      const element: React.ReactElement<IPageHeadingApplicationCustomizerProperties> = React.createElement(PageTitle, {parentTitle: this._parentTitle});
      const parentTitleDiv = document.createElement('div');
      parentTitleDiv.id = "bce-parent-title";
      this._pageHeaderContent.insertBefore(parentTitleDiv, this._pageHeaderContent.firstChild);
      ReactDOM.render(element,  document.getElementById("bce-parent-title"));
    }else{
      let heading = headingDiv.firstElementChild.innerHTML;
      if(heading !== this._parentTitle){
        headingDiv.firstElementChild.innerHTML = this._parentTitle;
      }
    }
  }

  private _pageHeaderReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      //this._compositeHeader = document.querySelector('.ms-compositeHeader') as HTMLElement;
      let contentPageContent = document.querySelector('[data-automation-id="pageHeader"] [class*="content"]') as HTMLElement;
      let contentPageTitle = document.querySelector('[data-automation-id="pageHeader"] span') as HTMLElement;
      let homePageContent = document.querySelector('[class*="canvasWrapper_"]') as HTMLElement;
      //let homePageTitle = document.querySelector('.ms-siteHeader-siteName > span') as HTMLElement;
      if(this._isHomePage){
        if (homePageContent ) {
          this._pageHeaderContent = homePageContent;
          //this._title = homePageTitle;
          resolve();
        } else if(this.count < 60) {
          setTimeout(checking.bind(null, resolve, reject), 100);
        } else {
          reject();
        }
        this.count++;
      }else{
        if (contentPageContent) {
          this._pageHeaderContent = contentPageContent;
          //this._title = contentPageTitle;
          resolve();
        } else if(this.count < 60) {
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
