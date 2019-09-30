import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as strings from 'GlobalIdentityApplicationCustomizerStrings';
import GlobalIdentity from './pages/GlobalIdentiy';
import styles from './GlobalIdentity.module.scss';


const LOG_SOURCE: string = 'GlobalIdentityApplicationCustomizer';
const globalIdentityId = "BCE_DesignSystem_GlobalIdentity";
export interface IGlobalIdentityApplicationCustomizerProperties {
  webAbsoluteUrl: string;
  class: string;
}

export default class GlobalIdentityApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalIdentityApplicationCustomizerProperties> {
  private _searchBox: Element | undefined;
  private _searchBoxSPO: Element | undefined;
  private _centerAlign: Element | undefined;
  private count: number = 0;
  private identityCount: number = 0;
  private isSPO: boolean;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    console.log('BCE Design System Branding Global Identity >> onInit()');
    this.isSPO = this.context.pageContext.legacyPageContext.isSPO;

    this._renderGlobalIdentity();
    this._renderGlobalIdentityOnSmall();
    return Promise.resolve();
  }

  //Add Global Identity on small device
  private _renderGlobalIdentityOnSmall(): void {
    try {

      let globalIdentityElement = React.createElement(GlobalIdentity,
        { webAbsoluteUrl: this.context.pageContext.legacyPageContext.webAbsoluteUrl, class: "bce-design-system-globalIdentity-top" });
      if (this.isSPO) {
        this._globalIdentityReady('._2ConVLM0sTbBwAbw2pat-3 #O365_SearchBoxContainer').then(() => {
          if (this._centerAlign.getElementsByClassName(styles.bceDesignSystemIdentity).length === 0) {
            ReactDOM.render(globalIdentityElement, this._centerAlign);
          }
        })
      } else {
        this._globalIdentityReady('.o365cs-nav-centerAlign').then(() => {
          if (this._centerAlign.getElementsByClassName(styles.bceDesignSystemIdentity).length === 0) {
            ReactDOM.render(globalIdentityElement, this._centerAlign);
          }
        })
      }
    } catch (e) {

    }
  }

  private _globalIdentityReady(element: string): Promise<void> {
    const checking = (resolve: any, reject: any) => {
      let centerAlign = document.querySelectorAll(element);
      if (centerAlign && centerAlign.length === 1) {
        this._centerAlign = centerAlign[0];
        this.identityCount = 0;
        resolve();
      } else if (this.identityCount < 60) {
        setTimeout(checking.bind(null, resolve, reject), 100);
      } else {
        reject();
      }
      this.identityCount++;
    };
    return new Promise(checking);
  }

  private _renderGlobalIdentity(): void {
    try {
      this._pageContainerReady().then(() => {
        let globalIdentityElement = React.createElement(GlobalIdentity,
          { webAbsoluteUrl: this.context.pageContext.legacyPageContext.webAbsoluteUrl, class: "bce-design-system-globalIdentity-left" });
        if (this.isSPO) {
          const divWarpper = document.createElement('div');
          divWarpper.id = globalIdentityId;
          this._searchBox.insertBefore(divWarpper, this._searchBox.firstChild);
          ReactDOM.render(globalIdentityElement, document.getElementById(globalIdentityId));
        } else {
          ReactDOM.render(globalIdentityElement, this._searchBox);
        }
      });
    } catch (e) {
      console.error('Fail to inject global identity');
    }

  }

  private _pageContainerReady(): Promise<void> {
    const checking = (resolve: any, reject: any) => {
      if (this.isSPO) {
        this._searchBox = document.querySelector('[class^=spNav_] > div');
        //        this._searchBox = document.querySelector('#O365_SearchBoxContainer');
      } else {
        this._searchBox = document.querySelector('.ms-searchux-searchbox > div');
      }
      if (this._searchBox) {
        this.count = 0;
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
}
