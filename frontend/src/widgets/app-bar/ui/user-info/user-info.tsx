'use client';
import { meQueries } from '@/entities/me';
import { useSignOut } from '@/features/sign-out';
import { Button } from '@heroui/react/button';
import { Dropdown } from '@heroui/react/dropdown';
import { Label } from '@heroui/react/label';
import { UserIcon } from '@phosphor-icons/react/User';
import { useQuery } from '@tanstack/react-query';

export const UserInfo = () => {
  const { data } = useQuery(meQueries.getMeQueryOptions);
  const { signOut, isPending: isSignOutPending } = useSignOut();

  return (
    <Dropdown>
      <Button variant="ghost">
        <UserIcon />
        {data?.username}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item onClick={signOut} isDisabled={isSignOutPending}>
            <Label>Sign out</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
