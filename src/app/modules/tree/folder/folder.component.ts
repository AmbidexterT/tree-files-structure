import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Folder } from 'src/app/models/folder.model';
import { File } from 'src/app/models/file.model';
import { SelectedItem } from 'src/app/models/selected-item.model';
import { FileComponent } from '../file/file.component';
import { Subject, Observable, of } from 'rxjs';
import { faPlus, faMinus, faStop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
})
export class FolderComponent implements OnInit, AfterViewInit {
  faPlus = faPlus;
  faMinus = faMinus;
  faStop = faStop;
  private _open = false;

  private _isViewChildrenFoldersReady: boolean = false;
  private _viewChildrenFoldersReady$: Subject<boolean> = new Subject<boolean>();

  private _isViewChildrenFilesReady: boolean = false;
  private _viewChildrenFilesReady$: Subject<boolean> = new Subject<boolean>();

  @ViewChildren(FolderComponent)
  folders: QueryList<FolderComponent>;

  @ViewChildren(FileComponent)
  files: QueryList<FileComponent>;

  @Input()
  folder: Folder;

  @Output()
  select: EventEmitter<SelectedItem> = new EventEmitter<SelectedItem>();

  get itemsAmount() {
    return this.folder.content.length;
  }

  get isOpen() {
    return this._open;
  }

  get isHide() {
    return this.folder.isHide;
  }

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    if (!!this.folder && this.folders.toArray().length == this.folder.amountFolders) {
      this._isViewChildrenFoldersReady = true;
      this._viewChildrenFoldersReady$.next(true);
    } else {
      this.folders.changes.subscribe(e => {
        this._isViewChildrenFoldersReady = true;
        this._viewChildrenFoldersReady$.next(true);
      });
    }

    if (!!this.folder && this.files.toArray().length == this.folder.amountFiles) {
      this._isViewChildrenFilesReady = true;
      this._viewChildrenFilesReady$.next(true);
    } else {
      this.files.changes.subscribe(e => {
        this._isViewChildrenFilesReady = true;
        this._viewChildrenFilesReady$.next(true);
      });
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
      return of(true);
    } else {
      return this._viewChildrenFilesReady$;
    }
  }

  onSelectSelf(open?: boolean) {

    if (!this.itemsAmount || this._open) {
      return;
    }

    let selectedItem = new SelectedItem();
    selectedItem.item = this.folder;
    selectedItem.path.push(this.folder.name);

    this.closeChildrenFolders();
    if (open) {
      this.open();
      // this.changeDetector.detectChanges();
    }

    this.select.emit(selectedItem);
  }

  onSelectedItem(selectedItem: SelectedItem) {

    this.folders.forEach(f => {
      if (f.folder.name != selectedItem.path[selectedItem.path.length - 1]) {
        f.closeChildrenFolders();
        f.close();
      }
    });

    selectedItem.path.push(this.folder.name);
    this.select.emit(selectedItem);

  }

  toggleOpen() {
    this._open = !this._open;
  }

  isFile(elem: File | Folder): boolean {
    return elem instanceof File;
  }

  open() {
    this._open = true;
  }

  close() {
    this._open = false;
  }

  show() {
    this.folder.isHide = false;
  }

  hide() {
    this.folder.isHide = true;
  }

  closeChildrenFolders() {

    this.folders.forEach(folder => {
      folder.closeChildrenFolders();
      folder.close();
    });
  }

  selectItem(arrayPath: Array<string>) {

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

    this.open();
    this.changeDetector.detectChanges();

  }

}
