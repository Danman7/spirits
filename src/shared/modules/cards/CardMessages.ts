import { AgentTraitName } from 'src/shared/modules/cards/CardTypes'

export const traitDescriptions: Record<
  AgentTraitName,
  { title: string; description: string }
> = {
  retaliates: {
    title: 'Retaliation:',
    description:
      'Each time this agent is attacked it strikes the attacker back.',
  },
}
