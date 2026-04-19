import { IconWeight, StarIcon } from '@phosphor-icons/react';
import { CSSProperties, MouseEvent, useCallback, useState } from 'react';
import classes from './rating.module.css';

export type TRatingProps = {
  size?: number;
  rating?: number;
  onChange?: (value: number) => void;
};

const weights: IconWeight[] = ['regular', 'fill', 'duotone'];

export const Rating = ({ size = 32, rating = 0, onChange }: TRatingProps) => {
  const [hoverId, setHoverIdx] = useState(-1);

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
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            aria-label={label}
          >
            {weights.map((w) => (
              <StarIcon
                key={w}
                size={size}
                weight={w}
                className="absolute inset-0"
                style={{ opacity: weight === w ? 1 : 0 }}
              />
            ))}
          </button>
        );
      })}
    </div>
  );
};
