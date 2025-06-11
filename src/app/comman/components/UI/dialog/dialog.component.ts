import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MatDialogModule,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule, MatDialogActions],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string }
  ) {}
  @Output() yesButton = new EventEmitter<void>();
  @Output() noButton = new EventEmitter<void>();

  onYes() {
    this.dialogRef.close(true);
  }

  onNo() {
    this.dialogRef.close(false);
  }
}
