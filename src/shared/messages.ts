import { TraitName } from 'src/shared/types'

export const traitDescriptions: Record<
  TraitName,
  { title: string; description: string }
> = {
  retaliates: {
    title: 'Retaliation:',
    description:
      'Each time this agent is attacked it strikes the attacker back.',
  },
}
