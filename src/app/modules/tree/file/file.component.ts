import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectedItem } from 'src/app/models/selected-item.model';
import { File } from 'src/app/models/file.model';
import { faFile } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})

export class FileComponent implements OnInit {
  faFile = faFile;

  @Input() file: File;
  @Output() select: EventEmitter<SelectedItem> = new EventEmitter<SelectedItem>();

  get isHide() {
    return this.file.isHide;
  }

  constructor() {}

  ngOnInit() {
  }

  onSelect() {
    let selectedItem = new SelectedItem();
    selectedItem.item = this.file;
    selectedItem.path.push(this.file.name);
    this.select.emit(selectedItem);
  }

  show() {
    this.file.isHide = false;
  }

  hide() {
    this.file.isHide = true;
  }

}
