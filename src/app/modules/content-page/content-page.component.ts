import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Folder } from 'src/app/models/folder.model';
import { File } from 'src/app/models/file.model';
import { SelectedItem } from 'src/app/models/selected-item.model';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentPageComponent implements OnInit {

  @Input()
  unit: SelectedItem;

  get items() {
    if (this.unit.item instanceof Folder) {
      return this.unit.item.content.length;
    } else {
      return 0;
    }
  }

  get isFile() {
    return this.unit.item instanceof File;
  }

  get haveElement() {
    return this.unit;
  }

  constructor() { }

  ngOnInit() {
  }

}
