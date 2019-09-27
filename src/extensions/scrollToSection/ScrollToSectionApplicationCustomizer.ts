import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as strings from 'ScrollToSectionApplicationCustomizerStrings';
import ScrollToSection from './pages/ScrollToSection';
import ExternalLinksIcon from './pages/ExternalLinksIcon';
const LOG_SOURCE: string = 'ScrollToSectionApplicationCustomizer';

export interface IScrollToSectionEntity {
  title: string;
  position: number;
}
export interface IScrollToSectionApplicationCustomizerProperties {
  headings: IScrollToSectionEntity[];
}

export default class ScrollToSectionApplicationCustomizer
  extends BaseApplicationCustomizer<IScrollToSectionApplicationCustomizerProperties> {
  private _pageContent: HTMLElement | undefined;
  private _h3: NodeListOf<Element> | undefined;

  private count: number = 0;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    this.context.application.navigatedEvent.add(this, (eventArgs: any) => {
      this._generatePageNavigation();
    });
    return Promise.resolve();
  }

  private _generatePageNavigation() : void {
    try{
      this._pageContentReady().then(() => {
        setTimeout(() => {
          this._processExternalLinks();
          this._h3 = document.querySelectorAll('h3.bce-design-system-sectionTitle');
          if (this._h3 && this._h3.length > 0){
            const array = Array.prototype.slice.call(this._h3);
            let headings : IScrollToSectionEntity[] = [];
            array.map((item: HTMLHeadingElement, index) => {
              headings.push({title: item.innerText, position: item.offsetTop});
            });
            const element: React.ReactElement<IScrollToSectionApplicationCustomizerProperties> = React.createElement(ScrollToSection, {headings: headings});
            const navigationDiv = document.createElement('div');
            navigationDiv.id = "bce-scroll-to-section";
            let pageHeaderContent = document.querySelector('[data-automation-id="pageHeader"] [class*="content"]') as HTMLElement;
            pageHeaderContent.appendChild(navigationDiv);
            ReactDOM.render(element,  document.getElementById("bce-scroll-to-section"));
            navigationDiv.style.display = 'block';
          }else{
            const navigationDiv = document.getElementById('bce-scroll-to-section') as HTMLElement;
            if(navigationDiv){
              navigationDiv.style.display = 'none';
            }
          }
        },1000);
      });
    }catch(e){

    }
  }

  private _processExternalLinks() : void {
    try{
      let currentOrigin: string = window.location.origin;
      let controlZone: HTMLElement = document.getElementById('spPageCanvasContent');
      if(controlZone){
        let a = controlZone.getElementsByTagName('a');
        for (let idx: number= 0; idx < a.length; ++idx){
          let href = a[idx].href.toLocaleLowerCase();
          if(href !== undefined && href.indexOf('#') !== 0 && href.indexOf('/') !== 0 && href.indexOf('javascript') !== 0 && a[idx].className.indexOf('ms-Button') === -1)
            if(href.indexOf(currentOrigin) === -1){
              a[idx].classList.add("bce-design-system-externalLinks");
              let text = a[idx].text as string;
              ReactDOM.render(React.createElement(ExternalLinksIcon,{text:text}),a[idx]);
            }
        }
      } 
    }catch(e){
    }
  }

  private _pageContentReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      this._pageContent = document.getElementById('spPageCanvasContent');
      let webpart: Element = document.querySelector('[class*="webPartContainer"');
      if (this._pageContent && webpart) {
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
}
