import { createElement } from 'react'
import { Player } from 'src/modules/duel/DuelTypes'
import {
  agentAttackLogMessage,
  agentRetaliatesLogMessage,
  discardLogMessage,
  hasDamagedSelfLogMessage,
  hasPlayedCardLogMessage,
  reduceCounterLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/DuelStateMessages'
import {
  Agent,
  AgentWithCounter,
  Card,
} from 'src/shared/modules/cards/CardTypes'
import { AccentText } from 'src/shared/styles/GlobalStyles'

export const generateTriggerLogMessage = (message: React.ReactNode) => (
  <AccentText>{message}</AccentText>
)

export const generatePlayerActionLogMessage = (
  player: Player,
  message: React.ReactNode,
  isHeading?: boolean,
) =>
  createElement(
    isHeading ? 'h3' : 'p',
    null,
    <>
      <strong style={{ color: player.color }}>{player.name}</strong>
      {message}
    </>,
  )

export const generateHasPlayedCardMessage = (player: Player, card: Card) => (
  <p>
    <strong style={{ color: player.color }}>{player.name}</strong>
    {hasPlayedCardLogMessage}
    <strong>{card.name}</strong> for {card.cost} coins.
  </p>
)

export const generateAttackLogMessage = (
  attackingAgent: Agent,
  defendingPlayer: Player,
  defendingAgent?: Agent,
) => (
  <p>
    <strong>{attackingAgent.name}</strong>
    {attackingAgent.traits?.retaliates && defendingAgent
      ? agentRetaliatesLogMessage
      : agentAttackLogMessage}
    {defendingAgent ? (
      <>
        <strong>{defendingAgent.name}</strong>
        {reduceStrengthLogMessage}
        {defendingAgent.strength - 1}.
      </>
    ) : (
      <>
        <strong style={{ color: defendingPlayer.color }}>
          {defendingPlayer.name}
        </strong>
        {reducingCoinsLogMessage}
        {defendingPlayer.coins - 1}.
      </>
    )}
  </p>
)

export const generateDiscardLogMessage = (
  discardingPlayer: Player,
  cardId: string,
) => (
  <p>
    <strong>{discardingPlayer.cards[cardId].name}</strong>
    {discardLogMessage}
  </p>
)

export const generateReduceCounterMessage = (agent: AgentWithCounter) => (
  <>
    <strong>{agent.name}</strong>
    {reduceCounterLogMessage}
    {agent.counter - 1}.
  </>
)

export const generateDamagedSelfLogMessage = (
  updatedCard: Agent,
  amount: number,
) => (
  <>
    <strong>{updatedCard.name}</strong>
    {hasDamagedSelfLogMessage}
    {amount}
  </>
)
