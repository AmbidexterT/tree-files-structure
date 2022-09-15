export class File {
    name: string;
    content: string;
    isHide: boolean = false;
    
    static createFrom(protopype: any): File {
        let file = new File();

        file.name = protopype.name;
        file.content = protopype.content;

        return file;
    }
    
}