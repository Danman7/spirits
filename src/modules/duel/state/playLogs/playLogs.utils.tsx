import { createElement } from 'react'

import { Player } from 'src/modules/duel/duel.types'
import {
  agentAttackLogMessage,
  agentRetaliatesLogMessage,
  boostedLogMessage,
  copiesLogMessage,
  discardLogMessage,
  hasDamagedSelfLogMessage,
  hasPlayedCardLogMessage,
  isPlayedLogMessage,
  playedLogMessage,
  reduceCounterLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  AgentWithCounter,
  Card,
} from 'src/shared/modules/cards/cards.types'
import { getCoinsMessage } from 'src/shared/shared.utils'
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
    <strong>{card.name}</strong> for {card.cost} {getCoinsMessage(card.cost)} (
    {player.coins - card.cost} {getCoinsMessage(player.coins - card.cost)}{' '}
    left).
  </p>
)

export const generateAttackLogMessage = (
  attackingAgent: Agent,
  defendingPlayer: Player,
  defendingAgent?: Agent,
  attackerIsActive?: boolean,
) => (
  <p>
    <strong>{attackingAgent.name}</strong>
    {attackingAgent.traits?.retaliates && defendingAgent && !attackerIsActive
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

export const generateDiscardLogMessage = (name: string) => (
  <p>
    <strong>{name}</strong>
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
    {amount}.
  </>
)

export const generatePlayedCopyLogMessage = (name: string) => (
  <>
    {copiesLogMessage}
    <strong>{name}</strong>
    {playedLogMessage}
  </>
)

export const generateBoostedLogMessage = (name: string, amount: number) => (
  <>
    <strong>{name}</strong>
    {boostedLogMessage}
    {amount}.
  </>
)

export const generatePlayedFromTriggerLogMessage = (name: string) => (
  <>
    <strong>{name}</strong>
    {isPlayedLogMessage}
  </>
)
