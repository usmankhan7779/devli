import { NgModule } from '@angular/core';
import { OrderBy } from './order-by.pipe';
import { LogoClassPipe } from './logo-class.pipe';
import { DropdownTitleShowPipe } from './dropdown-title-show.pipe';
import { HandleLeagueYearPipe } from './handle-league-year.pipe';
import { LogoPipe } from './logo.pipe';
import { PointZeroPipe } from './point-zero.pipe';
import { IsBeforeAfterPipe } from './isBeforeAfter.pipe';
import { ReversePipe } from './reverse-arr.pipe';
import { ShortPlayerNamePipe } from './short-player-name.pipe';
import { CapitalizeFirstPipe } from './capitalizefirst.pipe';
import { SecondsToMinutesPipe } from './seconds-to-minutes.pipe';
import { NumberWithCommasPipe } from './number-with-commas.pipe';
import { PercentagePipe } from './percentage.pipe';
import { LastTeamNamePipe } from './last-team-name.pipe';
import { OrdinalPipe } from './ordinal.pipe';
import { PlusPipe } from './plus.pipe';
import { MobileMinutesPipe } from './mobile-minutes.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { AmTimeZonePipe } from './am-time-zone.pipe';
import { ShowPercentagePipe } from './show-percentage.pipe';


@NgModule({
  imports: [

  ],
  declarations: [
    AmTimeZonePipe,
    CapitalizeFirstPipe,
    DropdownTitleShowPipe,
    HandleLeagueYearPipe,
    IsBeforeAfterPipe,
    LastTeamNamePipe,
    LogoPipe,
    LogoClassPipe,
    MobileMinutesPipe,
    NumberWithCommasPipe,
    OrderBy,
    OrdinalPipe,
    PercentagePipe,
    PlusPipe,
    PointZeroPipe,
    ReversePipe,
    SafeHtmlPipe,
    SecondsToMinutesPipe,
    ShortPlayerNamePipe,
    ShowPercentagePipe
  ],
  exports: [
    AmTimeZonePipe,
    CapitalizeFirstPipe,
    DropdownTitleShowPipe,
    HandleLeagueYearPipe,
    IsBeforeAfterPipe,
    LastTeamNamePipe,
    LogoPipe,
    LogoClassPipe,
    MobileMinutesPipe,
    NumberWithCommasPipe,
    OrderBy,
    OrdinalPipe,
    PercentagePipe,
    PlusPipe,
    PointZeroPipe,
    ReversePipe,
    SafeHtmlPipe,
    SecondsToMinutesPipe,
    ShortPlayerNamePipe,
    ShowPercentagePipe
  ],
  entryComponents: [

  ]
})
export class PipesModule {}
