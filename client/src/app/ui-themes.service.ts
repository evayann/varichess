import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

export enum ThemeMode {
  DARK, LIGHT
}

@Injectable()
export class UiThemesService {
  public theme$ = new BehaviorSubject<ThemeMode>(ThemeMode.LIGHT);
  private readonly THEME_KEY = "THEME";
  private readonly DARK_THEME_VALUE = "DARK";
  private readonly LIGHT_THEME_VALUE = "LIGHT";
  private readonly DARK_THEME_CLASS_NAME = "theme-dark";
  private readonly LIGHT_THEME_CLASS_NAME = "theme-light";
  private darkThemeSelected = false;

  constructor(private storage: LocalStorageService) { }

  public setThemeOnStart(): void {
    this.setTheme(this.DARK_THEME_VALUE);
    setTimeout(() => {
      document.body.classList.add("animate-theme-transition");
    }, 500);
  }

  public toggle(): void {
    this.setTheme(this.darkThemeSelected ?  this.LIGHT_THEME_VALUE : this.DARK_THEME_VALUE);
  }

  public isDark(): boolean {
    return this.darkThemeSelected;
  }

  private setTheme(theme: String): void {
    this.storage.set(this.THEME_KEY, theme);
    if (theme === this.LIGHT_THEME_VALUE) {
      document.body.classList.remove(this.DARK_THEME_CLASS_NAME);
      document.body.classList.add(this.LIGHT_THEME_CLASS_NAME);
      this.theme$.next(ThemeMode.DARK);
      this.darkThemeSelected = false;
    }
    else {
      document.body.classList.add(this.DARK_THEME_CLASS_NAME);
      document.body.classList.remove(this.LIGHT_THEME_CLASS_NAME);
      this.theme$.next(ThemeMode.LIGHT);
      this.darkThemeSelected = true;
    }
  }
}