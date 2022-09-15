import { Folder } from './folder.model';
import { File } from './file.model';

export class SelectedItem {
    item: File | Folder = null;
    path: Array<string> = [];

    get pathToString(): string {
        let reversePath = this.path.slice();
        reversePath.reverse();
        return reversePath.join('/') + ((this.item instanceof Folder) ? '/' : '');
    }
}
