import { Component, Input } from '@angular/core';
import { Card } from 'src/app/models/Card';
import { FileService } from 'src/app/services/common/file.service';

@Component({
    standalone: false,
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    @Input() card: Card = new Card();

    constructor(private fileService: FileService) {}

    getSrc(path: string){
        return this.fileService.getSrcWeb(this.fileService.getAbsolutePath(this.fileService.documentsUri(), path));
    }
}
