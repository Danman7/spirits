import { useState } from 'react'
import { ActionPanel } from 'src/modules/duel/components/ActionPanel'
import { DuelCardComponent } from 'src/modules/duel/components/DuelCard'
import { LogsPanel } from 'src/modules/duel/components/LogsPanel'
import { BotController } from 'src/modules/duel/components/PlayerField/BotController'
import { CardStackList } from 'src/modules/duel/components/PlayerField/CardStackList'
import { deckLabel } from 'src/modules/duel/components/PlayerField/PlayerFieldMessages'
import {
  DeckInfo,
  LeftPanelsWrapper,
  PlayerInfo,
  StyledPlayerField,
} from 'src/modules/duel/components/PlayerField/PlayerFieldStyles'
import { getStackConfiguration } from 'src/modules/duel/components/PlayerField/playerFieldUtils'
import { StackBrowseModal } from 'src/modules/duel/components/PlayerField/StackBrowseModal'
import { CARD_STACKS } from 'src/modules/duel/duelConstants'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { CardStack } from 'src/modules/duel/state/duelStateTypes'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'
import { Icon } from 'src/shared/components/Icon'

interface PlayerFieldProps {
  playerId: string
  isOnTop?: boolean
}

export const PlayerField: React.FC<PlayerFieldProps> = ({
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
        <DuelCardComponent
          key={cardId}
          playerId={player.id}
          cardId={cardId}
          isOnTop={isOnTop}
        />
      ))}
    </StyledPlayerField>
  )
}
