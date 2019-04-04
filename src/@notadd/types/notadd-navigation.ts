export interface NotaddNavigationItem {
    menuId: string;
    menuName: string;
    i18n?: string;
    type: 'item' | 'group' | 'collapse';
    menuIcon?: string;
    hidden?: boolean;
    menuUrl?: Array<string>;
    urlParam?: {[propName: string]: string | number};
    classes?: string;
    badge?: {
        title?: string;
        bg?: string;
        fg?: string;
    };
    childMenus?: Array<NotaddNavigationItem>;
}

export interface NotaddNavigation extends NotaddNavigationItem {
    childMenus?: Array<NotaddNavigationItem>;
}
