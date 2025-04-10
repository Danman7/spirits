import { useState } from 'react'
import { useTheme } from 'styled-components'

import { ActionPanel } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel'
import { BotController } from 'src/modules/duel/components/Board/PlayerField/BotController'
import { CardStackList } from 'src/modules/duel/components/Board/PlayerField/CardStackList'
import { LogsPanel } from 'src/modules/duel/components/Board/PlayerField/LogsPanel'
import { PlayCard } from 'src/modules/duel/components/Board/PlayerField/PlayCard'
import { incomeLabel } from 'src/modules/duel/components/Board/PlayerField/PlayerField.messages'
import {
  LeftPanelsWrapper,
  PlayerInfo,
  StyledPlayerField,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.styles'
import { getStackConfiguration } from 'src/modules/duel/components/Board/PlayerField/PlayerField.utils'
import { StackBrowseModal } from 'src/modules/duel/components/Board/PlayerField/StackBrowseModal'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { CARD_STACKS } from 'src/modules/duel/duel.constants'
import { getPlayerCardIds } from 'src/modules/duel/duel.utils'
import type { CardStack } from 'src/modules/duel/state'

import { AnimatedNumber, Icon } from 'src/shared/components'

export const PlayerField: React.FC<{ playerId: string; isOnTop?: boolean }> = ({
  playerId,
  isOnTop = false,
}) => {
  const {
    state: {
      players,
      playerOrder: [activePlayerId],
      cards,
      phase,
    },
  } = useDuel()

  const player = players[playerId]
  const { id, name, coins, income, isBot, color } = players[playerId]

  const [isBrowsingStack, setIsBrowsingStack] = useState(false)
  const [browsedStack, setBrowsedStack] = useState<CardStack>('deck')

  const { colors } = useTheme()

  const browseStack = (stack: CardStack) => {
    setBrowsedStack(stack)
    setIsBrowsingStack(true)
  }

  const onCloseBrowseStackModal = () => setIsBrowsingStack(false)

  const isActive =
    playerId === activePlayerId &&
    ['Player Turn', 'Select Target', 'Resolving turn'].includes(phase)

  return (
    <StyledPlayerField $isOnTop={isOnTop}>
      <PlayerInfo
        $color={color}
        $isActive={isActive}
        $isOnTop={isOnTop}
        data-testid={`${playerId}-info`}
      >
        <div>
          {name} <Icon name="Coins" color={colors.background} />{' '}
          <AnimatedNumber value={coins} uniqueId={id} />{' '}
          {isActive ? <Icon name="active" color={colors.background} /> : null}
        </div>

        {income ? (
          <small>
            {incomeLabel}

            {income}
          </small>
        ) : null}
      </PlayerInfo>

      {CARD_STACKS.map((stack) => (
        <CardStackList
          key={`${id}-${stack}`}
          config={getStackConfiguration(stack, isOnTop, browseStack)}
          stack={stack}
          player={player}
          isOnTop={isOnTop}
        />
      ))}

      {isBot ? <BotController playerId={id} /> : null}

      {!isOnTop ? (
        <LeftPanelsWrapper>
          <LogsPanel />
          <ActionPanel />
        </LeftPanelsWrapper>
      ) : null}

      <StackBrowseModal
        browsedCards={Object.fromEntries(
          Object.entries(cards).filter(([id]) =>
            player[browsedStack].includes(id),
          ),
        )}
        browsedStack={browsedStack}
        isOpen={isBrowsingStack}
        onClose={onCloseBrowseStackModal}
      />

      {getPlayerCardIds(player).map((cardId) => (
        <PlayCard
          key={cardId}
          playerId={player.id}
          cardId={cardId}
          isOnTop={isOnTop}
        />
      ))}
    </StyledPlayerField>
  )
}
