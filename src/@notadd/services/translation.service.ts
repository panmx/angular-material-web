import { Injectable } from '@angular/core';

import { NotaddLocale } from '@notadd/types';

@Injectable({
    providedIn: 'root'
})
export class NotaddTranslationService {

    constructor(

    ) {
    }

    /**
     * 设置给定语言的翻译对象
     * 如果要附加翻译而不是替换翻译，则应将 `shouldMerge` 设置为true
     * @param locales
     */
    setTranslation(locales: Array<NotaddLocale>) {

    }
}
