import { CardType } from '../../types';

interface CardIconProps {
  type: CardType;
}

export function CardIcon(props: Readonly<CardIconProps>) {
  return (
    <svg width="24" height="15" fill="none" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={props.type === CardType.PHYSICAL ? '#5bea83' : '#f3f2ef'}
        d="M0 1c0-.6.4-1 1-1h22c.6 0 1 .4 1 1v13c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1V1z"
      />
      <path
        fill="#000"
        opacity="0.05"
        d={
          'M1.5 0H1C.4 0 0 .4 0 1v6.2l24 4.5V7.1L1.5 0zm8.1 13.1V15H23c.6 0 1-.4 1-1v-.2l-13.2-1.7a1 ' +
          '1 0 0 0-1.2 1zM20.2 2.2V0h-9.5l8.2 3.1c.6.2 1.3-.2 1.3-.9z'
        }
      />
    </svg>
  );
}
