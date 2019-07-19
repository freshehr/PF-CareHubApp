import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
var routes = [
    // { path: '', redirectTo: 'h', pathMatch: 'full'},
    { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
    { path: 'mydetails', loadChildren: './mydetails/mydetails.module#MydetailsPageModule' },
    { path: 'mytreatmentplan', loadChildren: './mytreatmentplan/mytreatmentplan.module#MytreatmentplanPageModule' },
    { path: 'mydatalog', loadChildren: './mydatalog/mydatalog.module#MydatalogPageModule' },
    { path: 'h', loadChildren: './onboard/onboard.module#OnboardPageModule' },
    { path: 'onboardtreatmentplan', loadChildren: './onboardtreatmentplan/onboardtreatmentplan.module#OnboardtreatmentplanPageModule' },
    { path: 'onboardothermeds', loadChildren: './onboardothermeds/onboardothermeds.module#OnboardothermedsPageModule' },
    { path: 'pre-reading', loadChildren: './pre-reading/pre-reading.module#PreReadingPageModule' },
    { path: 'input-reading', loadChildren: './input-reading/input-reading.module#InputReadingPageModule' },
    { path: 'confirm-reading', loadChildren: './input-reading/confirm-reading/confirm-reading.module#ConfirmReadingPageModule' },
    { path: 'edit', loadChildren: './mytreatmentplan/edit/edit.module#EditPageModule' },
    { path: 'editdetails', loadChildren: './mydetails/editdetails/editdetails.module#EditdetailsPageModule' },
    { path: 'exportlog', loadChildren: './mydatalog/exportlog/exportlog.module#ExportlogPageModule' },
    { path: 'check-profile', loadChildren: './check-profile/check-profile.module#CheckProfilePageModule' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map