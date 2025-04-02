import { useState } from 'react'

import { ActionPanel } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel'
import { BotController } from 'src/modules/duel/components/Board/PlayerField/BotController'
import { CardStackList } from 'src/modules/duel/components/Board/PlayerField/CardStackList'
import { LogsPanel } from 'src/modules/duel/components/Board/PlayerField/LogsPanel'
import { PlayCard } from 'src/modules/duel/components/Board/PlayerField/PlayCard'
import { deckLabel } from 'src/modules/duel/components/Board/PlayerField/PlayerField.messages'
import {
  DeckInfo,
  LeftPanelsWrapper,
  PlayerInfo,
  StyledPlayerField,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.styles'
import { getStackConfiguration } from 'src/modules/duel/components/Board/PlayerField/PlayerField.utils'
import { StackBrowseModal } from 'src/modules/duel/components/Board/PlayerField/StackBrowseModal'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { CARD_STACKS } from 'src/modules/duel/duel.constants'
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
    },
  } = useDuel()

  const player = players[playerId]
  const { id, name, coins, income, isBot, deck, discard, board, hand } =
    players[playerId]

  const [isBrowsingStack, setIsBrowsingStack] = useState(false)
  const [browsedStack, setBrowsedStack] = useState<CardStack>('deck')

  const browseStack = (stack: CardStack) => {
    setBrowsedStack(stack)
    setIsBrowsingStack(true)
  }

  const onCloseBrowseStackModal = () => setIsBrowsingStack(false)

  return (
    <StyledPlayerField $isOnTop={isOnTop}>
      <PlayerInfo
        $isActive={playerId === activePlayerId}
        $isOnTop={isOnTop}
        data-testid={`${playerId}-info`}
      >
        <span>{name}</span> / <AnimatedNumber value={coins} uniqueId={id} />
        {income ? <span> (+{income})</span> : null}
      </PlayerInfo>

      {deck.length ? (
        <DeckInfo>
          <Icon name="deck" isSmall /> {deckLabel} ({deck.length})
        </DeckInfo>
      ) : null}

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

      {[...deck, ...discard, ...board, ...hand].map((cardId) => (
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
