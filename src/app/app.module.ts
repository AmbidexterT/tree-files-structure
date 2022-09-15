import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ExplorerComponent } from './modules/explorer.component';
import { DataService } from './services/data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './modules/search/search.component';
import { ContentPageComponent } from './modules/content-page/content-page.component';
import { TreeContentComponent } from './modules/tree/tree-content.component';
import { FileComponent } from './modules/tree/file/file.component';
import { FolderComponent } from './modules/tree/folder/folder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    ExplorerComponent,
    SearchComponent,
    ContentPageComponent,
    TreeContentComponent,
    FileComponent,
    FolderComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [
    DataService,
    HttpClient
  ],
  bootstrap: [ExplorerComponent]
})
export class AppModule { }
