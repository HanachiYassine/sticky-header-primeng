import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appStickyHeader]',
  standalone: true,
})
export class StickyHeaderDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private table!: HTMLElement;
  private thead!: HTMLElement;

  ngAfterViewInit(): void {
    this.table = this.el.nativeElement;
    this.thead = this.table.querySelector('thead')!;

    if (this.thead) {
      this.applyStickyStyles();
      this.syncColumnWidths();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.syncColumnWidths();
  }

  private applyStickyStyles(): void {
    const thElements = this.thead.querySelectorAll('th');
    thElements.forEach((th: HTMLElement) => {
      this.renderer.setStyle(th, 'position', 'sticky');
      this.renderer.setStyle(th, 'top', '0');
      this.renderer.setStyle(th, 'z-index', '10'); // Pour éviter que le contenu ne recouvre les en-têtes
      this.renderer.setStyle(th, 'background-color', 'white'); // Optionnel : couleur de fond
    });
  }

  private syncColumnWidths(): void {
    const tbody = this.table.querySelector('tbody');
    if (!tbody) return;

    const tbodyRow = tbody.querySelector('tr');
    const theadRow = this.thead.querySelector('tr');

    if (!tbodyRow || !theadRow) return;

    const tbodyCells = tbodyRow.querySelectorAll('td');
    const theadCells = theadRow.querySelectorAll('th');

    if (theadCells.length !== tbodyCells.length) return;

    theadCells.forEach((th: HTMLElement, index: number) => {
      const td = tbodyCells[index] as HTMLElement;
      const width = td.getBoundingClientRect().width;
      this.renderer.setStyle(th, 'width', `${width}px`);
    });
  }
}
