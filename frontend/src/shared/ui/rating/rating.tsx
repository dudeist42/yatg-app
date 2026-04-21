import { type IconWeight } from '@phosphor-icons/react';
import { StarIcon } from '@phosphor-icons/react/Star';
import {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import classes from './rating.module.css';
import clsx from 'clsx';

export type TRatingProps = {
  size?: number;
  rating?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

const weights: IconWeight[] = ['regular', 'fill', 'duotone'];

export const Rating = ({
  size = 32,
  rating = 0,
  onChange,
  disabled,
}: TRatingProps) => {
  const [hoverId, setHoverIdx] = useState(-1);

  const resetHover = useEffectEvent(() => {
    setHoverIdx(-1);
  });

  useEffect(() => {
    if (disabled) {
      resetHover();
    }
  }, [disabled]);

  const onMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const n = Number(event.currentTarget.dataset.idx);
    if (n >= 1 && n <= 5) setHoverIdx(n);
  }, []);

  const onMouseLeave = useCallback(() => setHoverIdx(-1), []);

  const onClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const n = Number(event.currentTarget.dataset.idx);
      if (n >= 1 && n <= 5) onChange?.(n);
    },
    [onChange],
  );

  const isHovering = hoverId > 0;

  const getStarWeight = (n: number) => {
    const isSet = n <= rating;

    let weight: 'fill' | 'regular' | 'duotone';

    if (isHovering) {
      const inHoverZone = n <= hoverId;

      if (hoverId === rating) {
        weight = isSet ? 'duotone' : 'regular';
      } else if (hoverId > rating) {
        weight = isSet ? 'fill' : inHoverZone ? 'duotone' : 'regular';
      } else {
        weight = inHoverZone ? 'duotone' : isSet ? 'regular' : 'regular';
      }
    } else {
      weight = isSet ? 'fill' : 'regular';
    }

    return weight;
  };

  return (
    <div
      className={classes.root}
      style={{ '--star-size': `${size}px` } as CSSProperties}
    >
      {Array.from({ length: 5 }, (_, idx) => {
        const n = idx + 1;

        const weight = getStarWeight(n);
        const label = `set rating ${n} of 5`;

        return (
          <button
            key={n}
            className={classes.starBtn}
            data-idx={n}
            onMouseEnter={disabled ? undefined : onMouseEnter}
            onMouseLeave={disabled ? undefined : onMouseLeave}
            onClick={disabled ? undefined : onClick}
            aria-label={label}
            disabled={disabled}
          >
            {weights.map((w) => (
              <StarIcon
                key={w}
                size={size}
                weight={w}
                className={clsx(
                  'absolute inset-0',
                  disabled && 'text-gray-500',
                )}
                style={{ opacity: weight === w ? 1 : 0 }}
              />
            ))}
          </button>
        );
      })}
    </div>
  );
};
