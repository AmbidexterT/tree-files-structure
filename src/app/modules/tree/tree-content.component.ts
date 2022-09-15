import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChildren,
  QueryList,
  AfterViewInit,
  AfterContentChecked,
} from '@angular/core';
import { Folder } from 'src/app/models/folder.model';
import { File } from 'src/app/models/file.model';
import { SelectedItem } from 'src/app/models/selected-item.model';
import { FolderComponent } from './folder/folder.component';
import { FileComponent } from './file/file.component';
import { Subject, of, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-path-viewer',
  templateUrl: './tree-content.component.html',
  styleUrls: ['./tree-content.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeContentComponent implements OnInit, AfterViewInit, AfterContentChecked {

  _isViewChildrenFoldersReady: boolean = false;
  _viewChildrenFoldersReady$: Subject<boolean> = new Subject<boolean>();

  _isViewChildrenFilesReady: boolean = false;
  _viewChildrenFilesReady$: Subject<boolean> = new Subject<boolean>();

  _isRootReady: boolean = false;
  _RootReady$: Subject<boolean> = new Subject<boolean>();

  @ViewChildren(FolderComponent)
  folders: QueryList<FolderComponent>;

  @ViewChildren(FileComponent)
  files: QueryList<FileComponent>;

  @Input()
  rootFolder: Folder;

  @Output()
  select: EventEmitter<SelectedItem> = new EventEmitter<SelectedItem>();

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    if (!!this.rootFolder && this.folders.toArray().length == this.rootFolder.amountFolders) {
      this._isViewChildrenFoldersReady = true;
      this._viewChildrenFoldersReady$.next(true);
    } else {
      this.folders.changes.subscribe(e => {
        this._isViewChildrenFoldersReady = true;
        this._viewChildrenFoldersReady$.next(true);
      });
    }

    if (!!this.rootFolder && this.files.toArray().length == this.rootFolder.amountFiles) {
      this._isViewChildrenFilesReady = true;
      this._viewChildrenFilesReady$.next(true);
    } else {
      this.files.changes.subscribe(e => {
        this._isViewChildrenFilesReady = true;
        this._viewChildrenFilesReady$.next(true);
      });
    }

  }

  ngAfterContentChecked() {
    if (!this._isRootReady && !!this.rootFolder) {
      this._isRootReady = true;
      this._RootReady$.next(true);
    }
  }

  checkViewClidrenFoldersReady$(): Observable<boolean> {
    if (this._isViewChildrenFoldersReady) {
      return of(true);
    } else {
      return this._viewChildrenFoldersReady$;
    }
  }

  checkViewClidrenFilesReady$(): Observable<boolean> {
    if (this._isViewChildrenFilesReady) {
      return of(true).pipe(first());
    } else {
      return this._viewChildrenFilesReady$.pipe(first());
    }
  }

  checkRoot(): Observable<boolean> {
    if (this._isRootReady) {
      return of(true).pipe(first());
    } else {
      return this._RootReady$.pipe(first());
    }
  }

  isFile(elem: File | Folder): boolean {
    return elem instanceof File;
  }

  onSelectedItem(selectedItem: SelectedItem) {
    this.select.emit(selectedItem);
    this.folders.forEach(f => {
      if (f.folder.name != selectedItem.path[selectedItem.path.length - 1]) {
        f.closeChildrenFolders();
        f.close();
      }
    });
  }

  selectItem(itemPath: string) {

    let arrayPath = itemPath.split('/');

    if (arrayPath.length == 1) {
      this.checkViewClidrenFilesReady$().subscribe(e => {
        let item = this.files.find(f => f.file.name == arrayPath[0]);
        item.onSelect();
      });
    } else if (arrayPath.length == 2 && arrayPath[arrayPath.length - 1] == '') {
      this.checkViewClidrenFoldersReady$().subscribe(e => {
        let item = this.folders.find(f => f.folder.name == arrayPath[0]);
        item.onSelectSelf(true);
      });
    } else {
      this.checkViewClidrenFoldersReady$().subscribe(e => {
        let item = this.folders.find(f => f.folder.name == arrayPath[0]);
        item.selectItem(arrayPath.slice(1, arrayPath.length));
      });
    }

  }

  search(query: string) {
    this.checkRoot()
      .subscribe(e => {
        this.rootFolder.search(query);
      });
  }

  closeChildrenFolders() {

    this.folders.forEach(folder => {
      folder.closeChildrenFolders();
      folder.close();
    });
  }


}
