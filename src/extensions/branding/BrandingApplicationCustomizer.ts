import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import styles from './scss/global.module.scss';
import { Log } from '@microsoft/sp-core-library';

const LOG_SOURCE: string = 'BrandingApplicationCustomizer';

export interface IBrandingApplicationCustomizerProperties {
  testMessage: string;
}

export default class BrandingApplicationCustomizer
  extends BaseApplicationCustomizer<IBrandingApplicationCustomizerProperties> {
    private _toplaceholder: PlaceholderContent | undefined;
    private _isAdmin: boolean | false;
    private _navHeader: HTMLElement | undefined;
    private _commandBar: HTMLElement | undefined;
    private _rightMenus: HTMLElement | undefined;
    private count= 0;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'OnInit - BCE Design System Branding');
    console.log('BCE Design System Branding >> onInit()');
    //this._renderTopPlaceHolder();
    this.context.application.navigatedEvent.add(this, (eventArgs: any) => {
       console.log('BCE Design System Branding >> this.context.application.navigatedEvent');
       //uncomment this to enable admin features
       //this._isAdmin = this.context.pageContext.legacyPageContext.isSiteAdmin;
       this._renderTopPlaceHolder();
       this._showNavHeaderForAdmin();
       this._showRightMenusOnSmallScreenForAdmin();
     });

    this.context.placeholderProvider.changedEvent.add(this, (eventArgs: any) => {
      // console.log('BCE Design System Branding >> this.context.application.changedEvent');
       //this._renderTopPlaceHolder(); 
     });
    return Promise.resolve();
  }

  //show right menu for adminUsers
  private _showRightMenusOnSmallScreenForAdmin() : void{
      if(this._isAdmin && window.screen.width > 1024){
        try{
          this._rightMenuReady().then(() => {
            this._rightMenus.style.display = 'block';
          })
        }catch(e){

        }
      }
    }

  private _showNavHeaderForAdmin(): void{
    if(this._isAdmin){
        try{
          this._navHeaderReady().then(() => {
            this._navHeader.style.setProperty('display', 'block', 'important');
            this._commandBar.style.setProperty('display', 'block', 'important');
          });
        }catch(e){
          console.error('Unable to hide nav header.');
        }
    }
  }

  private _renderTopPlaceHolder(): void {
    console.log('BCE Design System Branding >> _renderBottomPlaceHolder()');
    if (this._toplaceholder) {
      this._toplaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });
      if (!this._toplaceholder) {
        console.error('The expected placeholder (Bottom) was not found.');
        return;
      }
      this._toplaceholder.domElement.innerHTML =  `<div class="${styles.bceDesignSystem}"></div>`;
    }
  }

  private _onDispose(): void {
    console.log('[BrandingApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

  private _rightMenuReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      this._rightMenus = document.getElementById('O365_TopMenu') as HTMLElement;
      if (this._rightMenus) {
        resolve();
      } else if(this.count < 60) {
        setTimeout(checking.bind(undefined, resolve, reject), 100);
      } else {
        reject();
      }
      this.count++;
    };
    return new Promise(checking);
  }

  private _navHeaderReady(): Promise<void>{
    const checking = (resolve: any, reject: any) => {
      this._navHeader = document.getElementById('SuiteNavPlaceHolder') as HTMLElement;
      const commandBar = document.getElementsByClassName('commandBarWrapper');
      if (this._navHeader && commandBar && commandBar.length > 0) {
        this._commandBar = document.getElementsByClassName('commandBarWrapper')[0] as HTMLElement;
        resolve();
      } else if(this.count < 60) {
        setTimeout(checking.bind(undefined, resolve, reject), 100);
      } else {
        reject();
      }
      this.count++;
    };
    return new Promise(checking);
  }

}
