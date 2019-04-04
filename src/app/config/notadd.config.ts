import { NotaddConfig } from '@notadd/types';

export const notaddConfig: NotaddConfig = {
    layout: {
        style: 'vertical-layout',
        width: 'fullwidth',
        navbar: {
            background: 'mat-notadd-contrast-400-bg',
            secondaryBackground: 'mat-blue-A400-bg',
            collapsed: false,
            hidden: false,
            position: 'start'
        },
        toolbar: {
            background: 'mat-blue-A400-bg',
            hidden: false,
            position: 'below-fixed'
        },
        footer: {
            background: 'mat-notadd-dark-A700-bg',
            hidden: false,
            position: 'above'
        },
        sidepanel: {
            hidden: false,
            position: 'right'
        }
    },
    customScrollbars: true
};
