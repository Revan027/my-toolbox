import { Animation, AnimationController } from '@ionic/angular';

export const pageTransition = (baseEl: HTMLElement, opts?: any) => {
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;
    const animCtrl = new AnimationController();
    let enteringAnimation: Animation;
    let leavingAnimation: Animation;

    if(opts.direction == "forward"){
        leavingAnimation = animCtrl
            .create()
            .addElement(leavingEl)
            .fromTo('transform', 'translateX(0)', 'translateX(-100%)')
            .fromTo('opacity', '1', '1');

        enteringAnimation = animCtrl
            .create()
            .addElement(enteringEl)
            .fromTo('transform', 'translateX(100%)', 'translateX(0)')
            .fromTo('opacity', '1', '1');
    }else{
        leavingAnimation = animCtrl
            .create()
            .addElement(leavingEl)
            .fromTo('transform', 'translateX(0)', 'translateX(100%)')
            .fromTo('opacity', '1', '1');

        enteringAnimation = animCtrl
            .create()
            .addElement(enteringEl)
            .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
            .fromTo('opacity', '1', '1');
    }
    return animCtrl
        .create()
        .duration(500)
        .easing('ease-in-out')
        .addAnimation([leavingAnimation, enteringAnimation]);
};
