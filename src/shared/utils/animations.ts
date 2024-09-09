import {
  AnimationDefinition,
  TargetAndTransition,
  Variants
} from 'framer-motion'

export const NumberChangeAnimation: TargetAndTransition = {
  scale: [null, 1.4],
  color: [null, 'var(--hilight-color)'],
  transition: {
    repeat: 1,
    repeatType: 'reverse'
  }
}

export const CardBoostAnimation: AnimationDefinition = {
  scale: [null, 1.05],
  boxShadow: [null, `0 0 4px 4px var(--hilight-color)`],
  transition: {
    repeat: 1,
    repeatType: 'reverse'
  }
}

export const CardDamageAnimation: AnimationDefinition = {
  x: [0, 5, 0, -5, 0],
  transition: {
    repeat: 2,
    repeatType: 'reverse',
    duration: 0.1
  }
}

export const CardVariants: Variants = {
  normal: {
    width: '250px',
    height: '350px',
    fontSize: '16px',
    boxShadow: '1px 1px 1px var(--shadow-color)'
  },
  small: { width: '150px', height: '210px', fontSize: '10px' },
  active: {
    boxShadow: [
      '0 0 2px 2px var(--positive-color)',
      '0 0 4px 4px var(--positive-color)'
    ],
    transition: {
      repeat: Infinity,
      repeatType: 'reverse'
    }
  },
  boosted: {
    scale: [null, 1.1],
    boxShadow: [null, `0 0 4px 4px var(--hilight-color)`],
    transition: {
      repeat: 1,
      repeatType: 'reverse'
    }
  }
}

export const CardBackVariants: Variants = {
  normal: {
    background:
      'repeating-linear-gradient(45deg,#fff,#fff 10px,#999 10px,#999 20px)'
  },
  small: {
    background:
      'repeating-linear-gradient(45deg,#fff,#fff 5px,#999 5px,#999 10px)'
  }
}

export const CardStrengthVariants: Variants = {
  boosted: NumberChangeAnimation
}

export const FadeInOutVariants: Variants = {
  open: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.3
    }
  },
  closed: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.3
    }
  }
}

export const SlideInOutContentVariants: Variants = {
  open: {
    opacity: 1,
    x: [-50, 0]
  },
  closed: {
    opacity: 0,
    x: [0, 50]
  }
}
