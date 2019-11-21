import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { sp } from "@pnp/sp";
import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as strings from 'PageTitleApplicationCustomizerStrings';
import PageTitle from './pages/PageTitle';

const LOG_SOURCE: string = 'PageTitleApplicationCustomizer';

export interface IPageTitleApplicationCustomizerProperties {
  parentTitle: string;
}

export default class PageTitleApplicationCustomizer
  extends BaseApplicationCustomizer<IPageTitleApplicationCustomizerProperties> {
  private _pageHeaderContent: HTMLElement | undefined;
  private _compositeHeader: HTMLElement | undefined;
  private _title: HTMLElement | undefined;
  private _linkButtons: HTMLCollectionOf<Element> | undefined;
  private count: number = 0;
  private leftNavCount : number = 0;
  private _isHomePage : boolean = true;
  private _currentUrl: string;
  private _parentTitle: string;
  private _next: string;
  private _previous: string; 
  private _webUrl: string;
  ///////////////////Not in use, conbimed in Footer/////////////////////
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    this._isHomePage = this.context.pageContext.legacyPageContext.isWebWelcomePage;
    sp.setup({
      spfxContext: this.context
    });
    this.context.application.navigatedEvent.add(this, (eventArgs: any) => {
      console.log('BCE Design System Branding Page Title>> this.context.application.navigatedEvent');
      this._currentUrl = this.context.pageContext.legacyPageContext.serverRequestPath;
      this._webUrl = this.context.pageContext.legacyPageContext.webAbsoluteUrl;
    });
    return Promise.resolve();
  }


  private _ensureNodeHeading() {
    const headingDiv = document.getElementById("bce-parent-title") as HTMLElement;
    if(!headingDiv){
      const element: React.ReactElement<IPageTitleApplicationCustomizerProperties> = React.createElement(PageTitle, {parentTitle: this._parentTitle});
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

  private _generateParentHeading() : Promise<string>{
    const getHeading = (resolve: any, reject: any) => {
      let title = this._title.innerText;
      if(title && this._linkButtons.length > 0){
        const arrayButtons = Array.prototype.slice.call(this._linkButtons);
        arrayButtons.map((item:any, index)=>{
          item.click();
        });
        setTimeout(() => {
          let linkTexts = document.getElementsByClassName('ms-Nav-linkText');
          const arrayLinks = Array.prototype.slice.call(linkTexts);
          arrayLinks.map((item:any, index)=>{
            if (item.innerText === title){
              let parent = linkTexts[index].closest('ul.ms-Nav-navItems').closest('li.ms-Nav-navItem');
              let parentTitle = parent.firstElementChild.getElementsByClassName('ms-Nav-linkText')[0].innerHTML;
              resolve(parentTitle);
            }
          });
        }, 500);
      }
    };
    return new Promise(getHeading);
  }

  private _LeftNavReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      this._linkButtons = document.getElementsByClassName('ms-Nav-chevronButton');
      if(this._linkButtons.length > 0){
        resolve();
      }
      else if(this.leftNavCount < 120) {
        setTimeout(checking.bind(null, resolve, reject), 200);
      } else {
        reject();
      }
      this.leftNavCount++;
    };
    return new Promise(checking);
  }

  private _pageHeaderReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      this._compositeHeader = document.querySelector('.ms-compositeHeader') as HTMLElement;
      let contentPageContent = document.querySelector('[data-automation-id="pageHeader"] [class*="content"]') as HTMLElement;
      let contentPageTitle = document.querySelector('[data-automation-id="pageHeader"] span') as HTMLElement;
      let homePageContent = document.querySelector('[class*="canvasWrapper_"]') as HTMLElement;
      //let homePageTitle = document.querySelector('.ms-siteHeader-siteName > span') as HTMLElement;
      if(this._isHomePage){
        if (this._compositeHeader && homePageContent ) {
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
        if (this._compositeHeader && contentPageContent) {
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

