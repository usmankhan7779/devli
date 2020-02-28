import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class VideoDataService {

  addScript = new Subject<any>();

  private script;
  private parentEl;
  private container;
  private oldPlayer;

  zoneAwarePromise;


    private videoData = [
    // MLB Start
    {
      page: 'los-angeles-dodgers',
      fk: '4A0FAvFv'
    },
    {
      page: 'kansas-city-royals',
      fk: 'Id5k1RrR'
    },
    {
      page: 'san-diego-padres',
      fk: 'Uf9slTA9'
    },
    {
      page: 'seattle-mariners',
      fk: 'ElhAHLAG'
    },
    {
      page: 'texas-rangers',
      fk: 'sSgAuFyf'
    },
    {
      page: 'philadelphia-phillies',
      fk: 'sbmg79BF'
    },
    {
      page: 'boston-red-sox',
      fk: 'cHWg38My'
    },
    {
      page: 'minnesota-twins',
      fk: 'aCyyCsdp'
    },
    {
      page: 'new-york-mets',
      fk: 'bp2zajYT'
    },
    {
      page: 'chicago-cubs',
      fk: 'aPiBjc1Z'
    },
    {
      page: 'tampa-bay-rays',
      fk: '02GmmYVf'
    },
    {
      page: 'houston-astros',
      fk: 'x21DbQpO'
    },
    {
      page: 'oakland-athletics',
      fk: 'xqTyuZRk'
    },
    {
      page: 'milwaukee-brewers',
      fk: 'poJV80iu'
    },
    {
      page: 'arizona-diamondbacks',
      fk: 'lgBI4DbL'
    },
    {
      page: 'san-francisco-giants',
      fk: 'Y4XqE9JQ'
    },
    {
      page: 'pittsburgh-pirates',
      fk: 'HS9SO0fN'
    },
    {
      page: 'detroit-tigers',
      fk: 'fUNPeFIj'
    },
    {
      page: 'chicago-white-sox',
      fk: 'elvihyln'
    },
    {
      page: 'washington-nationals',
      fk: 'iWG6XX24'
    },
    {
      page: 'new-york-yankees',
      fk: 'gkDmLf5u'
    },
    {
      page: 'atlanta-braves',
      fk: 'Q0x84ulM'
    },
    {
      page: 'colorado-rockies',
      fk: '3f8Pi8jq'
    },
    {
      page: 'cleveland-indians',
      fk: 'SSR82W4c'
    },
    {
      page: 'baltimore-orioles',
      fk: 'gV9f42Rj'
    },
    {
      page: 'cincinnati-reds',
      fk: 'wq4Jaum5'
    },
    {
      page: 'toronto-blue-jays',
      fk: 'nHrh3Pwq'
    },
    {
      page: 'st-louis-cardinals',
      fk: 'sSNdF2YK'
    },
    {
      page: 'miami-marlins',
      fk: 'n4wGyYZF'
    },
    {
      page: 'los-angeles-angels',
      fk: 'zxPeH8RJ'
    },
    // MLB END

    // NBA Start

    {
      page: 'atlanta-hawks',
      fk: '30qKQFvc'
    },
    {
      page: 'boston-celtics',
      fk: 'AhLGtYWt'
    },
    {
      page: 'brooklyn-nets',
      fk: 'TZetBilA'
    },
    {
      page: 'charlotte-hornets',
      fk: 'N0DZaVEU'
    },
    {
      page: 'chicago-bulls',
      fk: 'wRZOEQ8I'
    },
    {
      page: 'cleveland-cavaliers',
      fk: 'dRJyLDrY'
    },
    {
      page: 'dallas-mavericks',
      fk: 'mcpwAJbp'
    },
    {
      page: 'denver-nuggets',
      fk: 'FpZ7nDQX'
    },
    {
      page: 'detroit-pistons',
      fk: '0tolqG2z'
    },
    {
      page: 'golden-state-warriors',
      fk: 'xjhNMals'
    },
    {
      page: 'houston-rockets',
      fk: 'QaysfcxM'
    },
    {
      page: 'indiana-pacers',
      fk: 'DUmugXpu'
    },
    {
      page: 'los-angeles-clippers',
      fk: 'k6v0KRLJ'
    },
    {
      page: 'los-angeles-lakers',
      fk: 'V35ccTZV'
    },
    {
      page: 'memphis-grizzlies',
      fk: '1hjRIKzH'
    },
    {
      page: 'miami-heat',
      fk: 'RGkM5Hka'
    },
    {
      page: 'milwaukee-bucks',
      fk: 'Zij30oPn'
    },
    {
      page: 'minnesota-timberwolves',
      fk: 'rsQPkYSx'
    },
    {
      page: 'new-orleans-pelicans',
      fk: 'i05psozE'
    },
    {
      page: 'new-york-knicks',
      fk: '3Z3GGDYw'
    },
    {
      page: 'oklahoma-city-thunder',
      fk: 'h4svqo1c'
    },
    {
      page: 'orlando-magic',
      fk: '7D46IGth'
    },
    {
      page: 'philadelphia-76ers',
      fk: 'Nj122z4V'
    },
    {
      page: 'phoenix-suns',
      fk: 'm0E7V7U2'
    },
    {
      page: 'portland-trail-blazers',
      fk: 'CT3FYh9n'
    },
    {
      page: 'sacramento-kings',
      fk: 'AedkUnoY'
    },
    {
      page: 'san-antonio-spurs',
      fk: 'kqJ6ZCi8'
    },
    {
      page: 'toronto-raptors',
      fk: 'YM8PdGBF'
    },
    {
      page: 'utah-jazz',
      fk: '2OcYCTXM'
    },
    {
      page: 'washington-wizards',
      fk: 'MIGWbzzW'
    },

    // NBA END

    // NFL Start

    {
      page: 'arizona-cardinals',
      fk: 'gJ1UmRLN'
    },
    {
      page: 'atlanta-falcons',
      fk: 'yJV25xOr'
    },
    {
      page: 'baltimore-ravens',
      fk: 'jchvj0J5'
    },
    {
      page: 'buffalo-bills',
      fk: '3zV2ZjcK'
    },
    {
      page: 'carolina-panthers',
      fk: '1Ql96mLK'
    },
    {
      page: 'chicago-bears',
      fk: 'exR7eK2K'
    },
    {
      page: 'cincinnati-bengals',
      fk: 'ldYFWCPp'
    },
    {
      page: 'cleveland-browns',
      fk: 'N1Q4Tj3h'
    },
    {
      page: 'dallas-cowboys',
      fk: 'EYvPZvfr'
    },
    {
      page: 'denver-broncos',
      fk: 'Bo2ghscw'
    },
    {
      page: 'detroit-lions',
      fk: 'wCk4mit0'
    },
    {
      page: 'green-bay-packers',
      fk: 'qOB45sLa'
    },
    {
      page: 'houston-texans',
      fk: 'CVZvgESg'
    },
    {
      page: 'indianapolis-colts',
      fk: '3sKzgCdm'
    },
    {
      page: 'jacksonville-jaguars',
      fk: '9BF9oYVm'
    },
    {
      page: 'kansas-city-chiefs',
      fk: 'HI9L591i'
    },
    {
      page: 'los-angeles-chargers',
      fk: 'ZQqE6TeC'
    },
    {
      page: 'los-angeles-rams',
      fk: 'RbFkPhlx'
    },
    {
      page: 'miami-dolphins',
      fk: 'jXsvPIwZ'
    },
    {
      page: 'minnesota-vikings',
      fk: 'eCGHvyiM'
    },
    {
      page: 'new-england-patriots',
      fk: 'Cx6QNryk'
    },
    {
      page: 'new-orleans-saints',
      fk: 'xKlMnIoc'
    },
    {
      page: 'new-york-giants',
      fk: 'kb76x1zo'
    },
    {
      page: 'new-york-jets',
      fk: 'xKc4bGrn'
    },
    {
      page: 'oakland-raiders',
      fk: '4YFTmjIv'
    },
    {
      page: 'philadelphia-eagles',
      fk: 'FrEHZP6l'
    },
    {
      page: 'pittsburgh-steelers',
      fk: 'S8QrZohm'
    },
    {
      page: 'san-francisco-49ers',
      fk: 'dwgzemIq'
    },
    {
      page: 'seattle-seahawks',
      fk: 'BBhe7wt9'
    },
    {
      page: 'tampa-bay-buccaneers',
      fk: 'ni2nBlir'
    },
    {
      page: 'tennessee-titans',
      fk: 'xWiHepF0'
    },
    {
      page: 'washington-redskins',
      fk: 'eSw21xQV'
    },

    {
      page: 'default',
      fk: 'M6IdMM55',
    },
    {
      page: '/mlb',
      fk: 'DRf3HDcb',
    },
    {
      page: '/nba',
      fk: 'eNO2QZpU',
    },
    {
      page: '/nfl',
      fk: '2bJ52cQN',
    },

    // NFL END
  ];

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document,
  ) {
    if (this.commonService.isBrowser() && window && (<any>window).Promise) {
      this.zoneAwarePromise = (<any>window).Promise;
    }
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  private getVideoDataByUrl(url) {
    for (let i = 0; i < this.videoData.length; i++) {
      if (url.indexOf(this.videoData[i].page) !== -1) {
        return this.videoData[i];
      }
    }
    if (url.indexOf('/mlb/') !== -1) {
      return this.videoData[this.videoData.length - 3];
    }
    if (url.indexOf('/nba/') !== -1) {
      return this.videoData[this.videoData.length - 2];
    }
    if (url.indexOf('/nfl/') !== -1) {
      return this.videoData[this.videoData.length - 1];
    }
    return this.videoData[this.videoData.length - 4];
  }

  onAddScript(teamLineupUrl: boolean) {
    // this.addScript.next(teamLineupUrl);
  }

  getCurrentPageVideoData() {
    const data = this.getVideoDataByUrl(this.commonService.getCurrentUrl());
    if (data) {
      return data;
    }
  }

  addVideoScriptMethod(pageVideoData) {
    this.script = this.renderer.createElement('script');
    // tslint:disable-next-line:max-line-length
    this.script.src = `\/\/embed.sendtonews.com/player3/embedcode.js?fk=${pageVideoData.fk}&cid=9539&offsetx=0&offsety=0&floatwidth=462&floatposition=bottom-right`;
    this.script.type = 'text/javascript';
    this.script.async = true;
    this.script.onload = () => {
      if (this.commonService.isBrowser() && this.zoneAwarePromise) {
        setTimeout(() => {
          if ((<any>window).Promise.toString() !== this.zoneAwarePromise.toString()) {
            (<any>window).Promise = this.zoneAwarePromise;
          }
        }, 10);
      }
    };
    this.renderer.setAttribute(this.script, 'data-type', 's2nScript');
    this.container = this.renderer.createElement('div');
    this.renderer.setAttribute(this.container, 'class', 's2nPlayer k-' + pageVideoData.fk);
    this.renderer.setAttribute(this.container, 'data-type', 'float');
    const isInPosition = this.document.body.querySelector('.main-video.in-position');
    this.parentEl = isInPosition || this.document.body.querySelector('.body-main-video');
    if (this.parentEl) {
      this.renderer.appendChild( this.parentEl, this.container);
      setTimeout(() => {
        try {
          this.renderer.appendChild(this.document.body, this.script);
        } catch (e) {
          console.log('Caught sendtonews video player error', e);
        }
        this.showMainVideo();
      }, 10);
    }
  }

  removeOldVideo() {
    this.oldPlayer = this.document.body.querySelector('.s2nFriendlyFrame') || this.document.body.querySelector('.s2nPlayer');
    if (this.oldPlayer) {
      try {
        this.showMainVideo(false);
        this.oldPlayer.parentElement.removeChild(this.oldPlayer);
        this.document.body.removeChild(this.script);
      } catch (e) {
        console.error('Can not remove old video script:', e);
      }
    }
    this.script = undefined;
    this.parentEl = undefined;
    this.container = undefined;
    this.oldPlayer = undefined;
  }

  addVideoScript() {
    this.removeOldVideo();
    setTimeout(() => {
      const pageVideoData = this.getCurrentPageVideoData();
      this.addVideoScriptMethod(pageVideoData);
    }, 0);
  }

  showMainVideo(boolean = true) {
    const mainVideoContainer = this.document.body.querySelector('.body-main-video');
    const videoContainer = this.document.body.querySelector('.body-main-video .s2nFriendlyFrame') ||
      this.document.body.querySelector('.body-main-video .s2nPlayer');
    if (boolean && mainVideoContainer && videoContainer) {
      this.renderer.setStyle(mainVideoContainer, 'display', 'block');
      return;
    }
    this.renderer.setStyle(mainVideoContainer, 'display', 'none');
  }
}
