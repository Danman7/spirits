interface StackComponentProps {
  id: string
  children?: React.ReactNode
  $isOnTop?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface StackConfiguration {
  component: React.ComponentType<StackComponentProps>
  showStackCount?: boolean
  onClickStack?: React.MouseEventHandler<HTMLDivElement>
}
