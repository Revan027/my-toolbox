import { AnimationController } from '@ionic/angular';

export const pageTransition = (baseEl: HTMLElement, opts?: any) => {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;

    const animCtrl = new AnimationController();

    const enterAnim = animCtrl
        .create()
        .addElement(enteringEl)
        .fromTo('transform', 'translateX(100%)', 'translateX(0)')
        .fromTo('opacity', '0.5', '1');

    const leaveAnim = animCtrl
        .create()
        .addElement(leavingEl)
        .fromTo('transform', 'translateX(0)', 'translateX(-100%)')
        .fromTo('opacity', '1', '0.5');

    return animCtrl
        .create()
        .duration(300)
        .easing('ease-in-out')
        .addAnimation([enterAnim, leaveAnim]);
};
