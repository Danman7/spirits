interface StackComponentProps {
  id: string
  $isOnTop?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface StackConfiguration {
  component: React.ComponentType<StackComponentProps>
  onClickStack?: React.MouseEventHandler<HTMLDivElement>
}
