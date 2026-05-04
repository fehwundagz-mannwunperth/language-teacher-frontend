import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  EditableHomeSectionContent,
  EditableHomeSections,
  HomeSectionKey,
} from '../../models/editable-home-content.model';
import { HomeContentService } from '../../core/services/home-content.service';
import { LanguageCode, TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { StudioNavigationComponent } from '../studio-navigation/studio-navigation.component';

type SectionFormValue = Omit<EditableHomeSectionContent, 'key'>;

@Component({
  selector: 'app-home-content',
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterLink,
    StudioNavigationComponent,
  ],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.scss',
})
export class HomeContentComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly homeContentService = inject(HomeContentService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translationService = inject(TranslationService);

  protected readonly sectionKeys: HomeSectionKey[] = [
    'hero',
    'teacherIntro',
    'lessonsServices',
    'testimonials',
  ];
  protected readonly currentLanguage = this.translationService.currentLanguage;
  protected readonly heroPreviewUrl = signal('');
  protected readonly selectedHeroImageName = signal('');
  protected readonly heroImageButtonLabel = computed<TranslationKey>(() =>
    this.selectedHeroImageName() ? 'homeContent.changeImage' : 'homeContent.chooseImage',
  );
  protected readonly movableSectionOrder = signal<HomeSectionKey[]>([]);
  protected readonly sectionForms: Record<HomeSectionKey, FormGroup> = {
    hero: this.createSectionForm(true),
    teacherIntro: this.createSectionForm(false),
    lessonsServices: this.createSectionForm(false),
    testimonials: this.createSectionForm(false),
  };

  private readonly syncFormWithLanguage = effect(() => {
    const language = this.currentLanguage();
    queueMicrotask(() => this.loadContentForLanguage(language));
  });

  protected save(): void {
    if (this.hasInvalidForms()) {
      this.markAllFormsAsTouched();
      return;
    }

    try {
      const language = this.currentLanguage();
      this.homeContentService.saveAdminHomeContent(language, this.buildSectionsFromForms());
      this.homeContentService.saveSectionOrder(['hero', ...this.movableSectionOrder()]);
      this.homeContentService.saveHeroImage(this.heroPreviewUrl());
      this.showSuccess('homeContent.saveSuccess');
    } catch {
      this.showError('homeContent.saveError');
    }
  }

  protected dropSection(event: CdkDragDrop<HomeSectionKey[]>): void {
    const nextOrder = [...this.movableSectionOrder()];
    moveItemInArray(nextOrder, event.previousIndex, event.currentIndex);
    this.movableSectionOrder.set(nextOrder);
  }

  protected previewHeroImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedHeroImageName.set(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.heroPreviewUrl.set(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  protected sectionLabelKey(sectionKey: HomeSectionKey): TranslationKey {
    return `homeContent.section.${sectionKey}` as TranslationKey;
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private createSectionForm(hasButtons: boolean): FormGroup {
    return this.formBuilder.nonNullable.group({
      label: ['', Validators.required],
      title: ['', Validators.required],
      summary: [''],
      primaryButtonText: [{ value: '', disabled: !hasButtons }],
      secondaryButtonText: [{ value: '', disabled: !hasButtons }],
    });
  }

  private loadContentForLanguage(language: LanguageCode): void {
    const content = this.homeContentService.getAdminHomeContent(language);

    this.sectionKeys.forEach((sectionKey) => {
      this.sectionForms[sectionKey].reset(content.sections[sectionKey]);
    });
    this.heroPreviewUrl.set(content.heroImageUrl);
    this.selectedHeroImageName.set('');
    this.movableSectionOrder.set(
      content.sectionOrder.filter((sectionKey) => sectionKey !== 'hero'),
    );
  }

  private hasInvalidForms(): boolean {
    return this.sectionKeys.some((sectionKey) => this.sectionForms[sectionKey].invalid);
  }

  private markAllFormsAsTouched(): void {
    this.sectionKeys.forEach((sectionKey) => this.sectionForms[sectionKey].markAllAsTouched());
  }

  private buildSectionsFromForms(): EditableHomeSections {
    return this.sectionKeys.reduce((sections, sectionKey) => {
      const value = this.sectionForms[sectionKey].getRawValue() as SectionFormValue;

      return {
        ...sections,
        [sectionKey]: {
          key: sectionKey,
          label: value.label.trim(),
          title: value.title.trim(),
          summary: value.summary.trim(),
          primaryButtonText: value.primaryButtonText?.trim(),
          secondaryButtonText: value.secondaryButtonText?.trim(),
        },
      };
    }, {} as EditableHomeSections);
  }

  private showSuccess(key: TranslationKey): void {
    this.snackBar.open(this.t(key), this.t('calendar.snackbar.close'), {
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }

  private showError(key: TranslationKey): void {
    this.snackBar.open(this.t(key), this.t('calendar.snackbar.close'), {
      duration: 3500,
      panelClass: 'error-snackbar',
    });
  }
}
