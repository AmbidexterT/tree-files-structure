import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Folder } from 'src/app/models/folder.model';
import { DataService } from 'src/app/services/data.service';
import { first, filter, map, distinctUntilChanged } from 'rxjs/operators';
import { SelectedItem } from 'src/app/models/selected-item.model';
import { TreeContentComponent } from './tree/tree-content.component';
import { faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-root',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {
    pathName: string = 'Root';
    isFolderPath: boolean = true;
    selectedItem: SelectedItem;
    rootFolder: Folder;
    faFolderOpen =  faFolderOpen;
    faFile =  faFile;

    @ViewChild(TreeContentComponent, { static: true })
    pathViever: TreeContentComponent;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private service: DataService,
        private changeDetector: ChangeDetectorRef) { }

    ngOnInit() {

        this.service.getFiles()
            .pipe(
                first()
            ).subscribe(data => {
                this.rootFolder = data;
            });

        this.route.queryParams.pipe(
            filter(q => !!q.path),
            first()
        ).subscribe(params => {
            this.pathViever.selectItem(params.path);
        });

        this.route.queryParams.pipe(
            map(params => params.search),
            distinctUntilChanged(),
            filter(s => s !== undefined),
        ).subscribe(s => {
            this.pathViever.search(s);
            this.selectedItem = null;
            this.pathViever.closeChildrenFolders();
        });

    }

    refreshSelectedItem(selectedItem: SelectedItem) {
        this.selectedItem = selectedItem;
        if (selectedItem.item instanceof Folder) {
          this.pathName = selectedItem.item.name;
          this.isFolderPath = true;
        } else {
          this.pathName = selectedItem.item.name;
          this.isFolderPath = false;
        }

        this.router.navigate([], {
            queryParams: { path: this.selectedItem.pathToString },
            queryParamsHandling: 'merge'
        });
        this.changeDetector.detectChanges();
    }

}
