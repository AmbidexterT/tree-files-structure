import { File } from './file.model';

export class Folder {

    static createFrom(protopype: any): Folder {
        let folder = new Folder();
        folder.name = protopype.name;
        folder.content = protopype.content.map(
            el => el.isFolder ? Folder.createFrom(el) : File.createFrom(el)
        );
        folder.sort();

        return folder;
    }

    name: string = '';
    content: Array<File | Folder> = [];
    isHide: boolean = false;

    get amountFolders() {
        return this.content.reduce((prevVal, item) => (item instanceof Folder) ? ++prevVal : prevVal, 0);
    }

    get amountFiles() {
        return this.content.reduce((prevVal, item) => (item instanceof File) ? ++prevVal : prevVal, 0);
    }

    sort() {
        this.content.sort((a, b) => {
            let isFolderA = a instanceof Folder;
            let isFolderB = b instanceof Folder;

            if (isFolderA && isFolderB) {
                if (a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            }

            if (isFolderA && !isFolderB) {
                return -1;
            }

            if (!isFolderA && isFolderB) {
                return 1;
            }

            if (!isFolderA && !isFolderB) {
                if (a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            }

            return 0;

        });
    }

    search(query: string): boolean {

        if (query == '') {
            this.showAllChildren();
            return true;
        }

        let haveResult = false;

        this.hideAllChildren();
        this.content.forEach(elem => {
            if (elem instanceof Folder) {
                elem.isHide = !elem.search(query) && (elem.name.indexOf(query) == -1);
            } else {
                elem.isHide = elem.name.indexOf(query) == -1;
            }
            haveResult = haveResult || !elem.isHide;

        });

        return haveResult;
    }

    hideAllChildren() {
        this.content.forEach(el => {
            if (el instanceof Folder) {
                el.hideAllChildren();
            }
            el.isHide = true;
        });
    }

    showAllChildren() {
        this.content.forEach(el => {
            if (el instanceof  Folder) {
                el.hideAllChildren();
            }
            el.isHide = false;
        });
    }


}
